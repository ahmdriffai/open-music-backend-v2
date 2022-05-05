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
      throw new InvariantError('Kolaborasi gagal ditambahkan');
    }

    return result.rows[0].id;
  }
}

module.exports = PlaylistSongsService;
