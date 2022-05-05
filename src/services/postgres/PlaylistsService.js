const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exception/InvariantError');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
    this._tableName = 'playlists';
  }

  async addPlaylist({ name, owner }) {
    const id = `playlils-${nanoid(16)}`;

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
}

module.exports = PlaylistsService;
