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
    this.getPlaylistSongHandler = this.getPlaylistSongHandler.bind(this);
    this.deletePlaylistSongHandler = this.deletePlaylistSongHandler.bind(this);
  }

  async postPlaylistSongHandler(request, h) {
    try {
      this._validator.validatePostPlaylistPayload(request.payload);
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

  async getPlaylistSongHandler(request, h) {
    try {
      const { id: playlistId } = request.params;
      const { id: credentialId } = request.auth.credentials;

      await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);

      const playlist = await this._playlistsService.getPlaylistById(playlistId);
      const songs = await this._songsService.getSongByPlaylsitId(playlistId);

      return {
        status: 'success',
        data: {
          playlist: {
            id: playlist.id,
            name: playlist.name,
            username: playlist.username,
            songs,
          },
        },
      };
    } catch (error) {
      return errorResponse(h, error);
    }
  }

  async deletePlaylistSongHandler(request, h) {
    try {
      this._validator.validatePostPlaylistPayload(request.payload);
      const { id: credentialId } = request.auth.credentials;

      const { songId } = request.payload;
      const { id: playlistId } = request.params;

      await this._songsService.existSongById(songId);

      await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);

      await this._playlistSongsService.deletePlaylistSong(playlistId, songId);

      return {
        status: 'success',
        message: 'Berhasil menambahkan lagu',
      };
    } catch (error) {
      return errorResponse(h, error);
    }
  }
}

module.exports = PlaylistSongsHandler;
