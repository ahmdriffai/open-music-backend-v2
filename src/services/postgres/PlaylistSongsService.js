const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exception/InvariantError');

class PlaylistSongsService {
  constructor() {
    this._pool = new Pool();
    this._tableName = 'playlist_songs';
  }

  async addPlaylistSong(playlistId, songId) {
    const id = `ps-${nanoid(16)}`;

    const query = {
      text: `INSERT INTO ${this._tableName} VALUES($1, $2, $3) RETURNING id`,
      values: [id, playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Lagu gagal ditambahkan ke playlist');
    }

    return result.rows[0].id;
  }

  async deletePlaylistSong(playlistId, songId) {
    const query = {
      text: `DELETE FROM ${this._tableName} WHERE playlist_id = $1 AND song_id = $2 RETURNING id`,
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Lagu gagal dihapus');
    }
  }
}

module.exports = PlaylistSongsService;
