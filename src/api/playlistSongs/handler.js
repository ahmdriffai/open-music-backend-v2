const errorResponse = require('../../payload/response/errorResponse');
const PlaylistSongsService = require('../../services/postgres/PlaylistSongsService');
const PlaylistsService = require('../../services/postgres/PlaylistsService');
const SongsService = require('../../services/postgres/SongsService');
const PlaylistSongsValidator = require('../../validator/playlistSongs');

class PlaylistSongsHandler {
  constructor() {
    this._validator = PlaylistSongsValidator;
    this._playlistsService = new PlaylistsService();
    this._playlistSongsService = new PlaylistSongsService();
    this._songsService = new SongsService();

    this.postPlaylistSongHandler = this.postPlaylistSongHandler.bind(this);
  }

  async postPlaylistSongHandler(request, h) {
    try {
      this._validator.validateplaylistPayload(request.payload);
      const { id: credentialId } = request.auth.credentials;

      const { songId } = request.payload;
      const { id: playlistId } = request.params;

      await this._songsService.existSongById(songId);

      await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);

      await this._playlistSongsService.addPlaylistSong(playlistId, songId);

      const response = h.response({
        status: 'success',
        message: 'Berhasil menambahkan lagu ke playlist',
      });
      response.code(201);
      return response;
    } catch (error) {
      return errorResponse(h, error);
    }
  }
}

module.exports = PlaylistSongsHandler;
