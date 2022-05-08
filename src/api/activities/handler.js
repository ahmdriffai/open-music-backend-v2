const ActivitiesService = require('../../services/postgres/ActivitiesService');
const PlaylistsService = require('../../services/postgres/PlaylistsService');
const errorResponse = require('../../utils/errorResponse');

class ActivitiesHandler {
  constructor() {
    this._activitiesService = new ActivitiesService();
    this._playlistsService = new PlaylistsService();

    this.getActivitiesHandler = this.getActivitiesHandler.bind(this);
  }

  async getActivitiesHandler(request, h) {
    try {
      const { id: playlistId } = request.params;

      const { id: credentialId } = request.auth.credentials;

      await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);

      const playlist = await this._playlistsService.getPlaylistById(playlistId);

      const activities = await this._activitiesService.getActivities(playlistId, credentialId);

      return {
        status: 'success',
        data: {
          playlistId: playlist.id,
          activities,
        },
      };
    } catch (error) {
      return errorResponse(h, error);
    }
  }
}

module.exports = ActivitiesHandler;
