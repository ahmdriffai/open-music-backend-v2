const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exception/InvariantError');

class AlbumsService {
  constructor() {
    this._pool = new Pool();
  }

  // menambahkan album
  async addAlbum({ name, year }) {
    const id = nanoid(16);

    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3) RETURNING id',
      values: [id, name, year],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Album gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  // getAlbumById() {}

  // editAlbumById() {}

  // deleteAlbumById() {}
}

module.exports = AlbumsService;
