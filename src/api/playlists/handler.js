const errorResponse = require('../../payload/response/errorResponse');
const PlaylistsService = require('../../services/postgres/PlaylistsService');
const PlaylistsValidator = require('../../validator/playlists');

class PlaylistsHandler {
  constructor() {
    this._validator = PlaylistsValidator;
    this._playlistsService = new PlaylistsService();

    this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
    this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this);
  }

  async postPlaylistHandler(request, h) {
    try {
      this._validator.validateplaylistPayload(request.payload);

      const { name } = request.payload;

      const { id: credentialId } = request.auth.credentials;

      const playlistId = await this._playlistsService.addPlaylist({ name, owner: credentialId });

      const response = h.response({
        status: 'success',
        message: 'Catatan berhasil ditambahkan',
        data: {
          playlistId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      return errorResponse(h, error);
    }
  }

  async getPlaylistsHandler(request, h) {
    try {
      const { id: credentialId } = request.auth.credentials;

      const playlists = await this._playlistsService.getPlaylist(credentialId);

      return {
        status: 'success',
        data: {
          playlists,
        },
      };
    } catch (error) {
      return errorResponse(h, error);
    }
  }
}

module.exports = PlaylistsHandler;
