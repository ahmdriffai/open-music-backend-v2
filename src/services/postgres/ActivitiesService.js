const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exception/InvariantError');

class ActivitiesService {
  constructor() {
    this._pool = new Pool();
    this._tableName = 'playlist_song_activities';
  }

  async addActivities({
    playlistId, songId, userId, action,
  }) {
    const id = `avtivities-${nanoid(16)}`;

    const time = new Date().toISOString();

    const query = {
      text: `INSERT INTO ${this._tableName} (id, playlist_id, song_id, user_id, action, time)
      VALUES($1, $2, $3, $4, $5, $6) RETURNING id`,
      values: [id, playlistId, songId, userId, action, time],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Activity gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getActivities(playlistId, userId) {
    const query = {
      text: `SELECT u.username, s.title, a.action, a.time 
      FROM ${this._tableName} AS a
      LEFT JOIN users AS u
      ON u.id = a.user_id
      LEFT JOIN songs AS s
      ON s.id = a.song_id 
      WHERE a.playlist_id = $1 
      AND a.user_id = $2`,
      values: [playlistId, userId],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }
}

module.exports = ActivitiesService;
