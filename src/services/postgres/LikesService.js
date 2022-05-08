const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const AuthorizationError = require('../../exception/AuthorizationError');
const NotFoundError = require('../../exception/NotFoundError');
const ChaceService = require('../redis/ChaceService');

class LikesService {
  constructor() {
    this._pool = new Pool();
    this._chaceService = new ChaceService();
    this._tableName = 'user_album_likes';
  }

  async addLike(userId, albumId) {
    const querySelect = {
      text: `SELECT id FROM ${this._tableName} WHERE user_id = $1 AND album_id = $2`,
      values: [userId, albumId],
    };

    const resultSelect = await this._pool.query(querySelect);

    if (resultSelect.rows.length) {
      const query = {
        text: `DELETE FROM ${this._tableName} WHERE id = $1`,
        values: [resultSelect.rows[0].id],
      };
      await this._pool.query(query);

      await this._chaceService.delete(`likes:${albumId}`);

      return 'Album batal disukai';
    }

    const id = `like-${nanoid(16)}`;
    const query = {
      text: `INSERT INTO ${this._tableName} VALUES($1, $2, $3) RETURNING id`,
      values: [id, userId, albumId],
    };

    await this._pool.query(query);

    await this._chaceService.delete(`likes:${albumId}`);

    return 'Album disukai';
  }

  async getLikes(albumId) {
    try {
      const result = await this._chaceService.get(`likes:${albumId}`);
      return { likes: JSON.parse(result), caches: 1 };
    } catch (error) {
      const query = {
        text: `SELECT user_id FROM ${this._tableName} WHERE album_id = $1`,
        values: [albumId],
      };

      const result = await this._pool.query(query);

      await this._chaceService.set(`likes:${albumId}`, JSON.stringify(result.rowCount));

      return { likes: JSON.parse(result.rowCount), caches: 0 };
    }
  }

  async verifyAlbumLike(albumId, userId) {
    if (!userId) {
      throw new AuthorizationError('Anda belum login');
    }
    const query = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }
  }
}

module.exports = LikesService;
