const errorResponse = require('../../payload/response/errorResponse');
const SongsService = require('../../services/postgres/SongsService');
const SongsValidator = require('../../validator/songs/index');

class SongsHandler {
  constructor() {
    this._songService = new SongsService();
    this._validator = SongsValidator;

    this.postSongHandler = this.postSongHandler.bind(this);
    this.getSongsHandler = this.getSongsHandler.bind(this);
    this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
    this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
    this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
  }

  async postSongHandler(request, h) {
    try {
      this._validator.validateSongsPayload(request.payload);
      const {
        title, year, genre, performer, duration, albumId,
      } = request.payload;

      const songId = await this._songService.addSong({
        title,
        year,
        performer,
        genre,
        duration,
        albumId,
      });

      const response = h.response({
        status: 'success',
        data: {
          songId,
        },
      });

      response.code(201);
      return response;
    } catch (error) {
      return errorResponse(h, error);
    }
  }

  async getSongsHandler(request) {
    const { title = '', performer = '' } = request.query;

    const songs = await this._songService.getSongs({ title, performer });

    return {
      status: 'success',
      data: {
        songs,
      },
    };
  }

  async getSongByIdHandler(request, h) {
    try {
      const { id } = request.params;

      const song = await this._songService.getSongById(id);

      return {
        status: 'success',
        data: {
          song,
        },
      };
    } catch (error) {
      return errorResponse(h, error);
    }
  }

  async putSongByIdHandler(request, h) {
    try {
      this._validator.validateSongsPayload(request.payload);

      const { id } = request.params;
      const {
        title, year, genre, performer, duration,
      } = request.payload;

      await this._songService.editSongById(id, {
        title,
        year,
        performer,
        genre,
        duration,
      });

      const response = h.response({
        status: 'success',
        message: 'Berhasil memperbarui song',
      });

      return response;
    } catch (error) {
      return errorResponse(h, error);
    }
  }

  async deleteSongByIdHandler(request, h) {
    try {
      const { id } = request.params;
      await this._songService.deleteSongById(id);

      const response = h.response({
        status: 'success',
        message: 'Berhasil menghapus song',
      });

      return response;
    } catch (error) {
      return errorResponse(h, error);
    }
  }
}

module.exports = SongsHandler;
