const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const AuthorizationError = require('../../exception/AuthorizationError');
const InvariantError = require('../../exception/InvariantError');
const NotFoundError = require('../../exception/NotFoundError');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
    this._tableName = 'playlists';
  }

  async addPlaylist({ name, owner }) {
    const id = `playlist-${nanoid(16)}`;

    const query = {
      text: `INSERT INTO ${this._tableName} (id, name, owner) VALUES ($1, $2, $3) RETURNING id`,
      values: [id, name, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getPlaylist(owner) {
    const query = {
      text: `SELECT p.id, p.name, u.username 
      FROM ${this._tableName} AS p 
      LEFT JOIN users AS u
      ON u.id = p.owner
      WHERE p.owner = $1`,
      values: [owner],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async getPlaylistById(id) {
    const query = {
      text: `SELECT p.id, p.name, u.username 
      FROM ${this._tableName} AS p 
      LEFT JOIN users AS u
      ON u.id = p.owner
      WHERE p.id = $1`,
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    return result.rows[0];
  }

  async deleteById(id) {
    const query = {
      text: `DELETE FROM ${this._tableName} WHERE id = $1 RETURNING id`,
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan');
    }
  }

  async verifyPlaylistOwner(id, owner) {
    const query = {
      text: `SELECT * FROM ${this._tableName} WHERE id = $1`,
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    const playlist = result.rows[0];

    if (playlist.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }
}

module.exports = PlaylistsService;
