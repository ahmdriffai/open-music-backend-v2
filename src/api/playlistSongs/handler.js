const ActivitiesService = require('../../services/postgres/ActivitiesService');
const CollaborationsService = require('../../services/postgres/CollaborationsService');
const PlaylistSongsService = require('../../services/postgres/PlaylistSongsService');
const PlaylistsService = require('../../services/postgres/PlaylistsService');
const SongsService = require('../../services/postgres/SongsService');
const errorResponse = require('../../utils/errorResponse');
const PlaylistSongsValidator = require('../../validator/playlistSongs');

class PlaylistSongsHandler {
  constructor() {
    this._validator = PlaylistSongsValidator;
    this._playlistsService = new PlaylistsService();
    this._playlistSongsService = new PlaylistSongsService();
    this._songsService = new SongsService();
    this._collaborationsService = new CollaborationsService();
    this._activitiesService = new ActivitiesService();

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

      await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);

      await this._playlistSongsService.verifyPlaylistSongs(playlistId, songId);

      await this._playlistSongsService.addPlaylistSong(playlistId, songId);

      await this._activitiesService.addActivities({
        playlistId, songId, userId: credentialId, action: 'add',
      });

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

      await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);

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

      await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);

      await this._playlistSongsService.deletePlaylistSong(playlistId, songId);

      await this._activitiesService.addActivities({
        playlistId, songId, userId: credentialId, action: 'delete',
      });

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
