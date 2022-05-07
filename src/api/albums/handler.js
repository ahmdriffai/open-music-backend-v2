const AlbumsService = require('../../services/postgres/AlbumsService');
const errorResponse = require('../../utils/errorResponse');
const AlbumsValidator = require('../../validator/albums/index');

class AlbumsHandler {
  constructor() {
    this._albumsService = new AlbumsService();
    this._validator = AlbumsValidator;

    this.postAlbumHandler = this.postAlbumHandler.bind(this);
    this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
    this.putAlbumByIdHandler = this.putAlbumByIdHandler.bind(this);
    this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this);
  }

  async postAlbumHandler(request, h) {
    try {
      this._validator.validateAlbumPayload(request.payload);

      const { name, year } = request.payload;
      const albumId = await this._albumsService.addAlbum({ name, year });

      const response = h.response({
        status: 'success',
        data: {
          albumId,
        },
      });

      response.code(201);
      return response;
    } catch (error) {
      return errorResponse(h, error);
    }
  }

  async getAlbumByIdHandler(request, h) {
    try {
      const { id } = request.params;

      const album = await this._albumsService.getAlbumById(id);

      return {
        status: 'success',
        data: {
          album,
        },
      };
    } catch (error) {
      return errorResponse(h, error);
    }
  }

  async putAlbumByIdHandler(request, h) {
    try {
      this._validator.validateAlbumPayload(request.payload);

      const { id } = request.params;
      const { name, year } = request.payload;

      await this._albumsService.editAlbumById(id, { name, year });

      const response = h.response({
        status: 'success',
        message: 'Berhasil memperbarui album',
      });

      return response;
    } catch (error) {
      return errorResponse(h, error);
    }
  }

  async deleteAlbumByIdHandler(request, h) {
    try {
      const { id } = request.params;
      await this._albumsService.deleteAlbumById(id);

      const response = h.response({
        status: 'success',
        message: 'Berhasil menghapus album',
      });

      return response;
    } catch (error) {
      return errorResponse(h, error);
    }
  }
}

module.exports = AlbumsHandler;
