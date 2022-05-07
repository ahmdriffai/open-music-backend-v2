const CollaborationsService = require('../../services/postgres/CollaborationsService');
const PlaylistsService = require('../../services/postgres/PlaylistsService');
const UserServices = require('../../services/postgres/UsersService');
const errorResponse = require('../../utils/errorResponse');
const CollaborationsValidator = require('../../validator/collaborations');

class CollaborationsHandler {
  constructor() {
    this._validator = CollaborationsValidator;
    this._collaborationsService = new CollaborationsService();
    this._playlistService = new PlaylistsService();
    this._userServices = new UserServices();

    this.postCollaborationHandler = this.postCollaborationHandler.bind(this);
    this.deleteCollaborationHandler = this.deleteCollaborationHandler.bind(this);
  }

  async postCollaborationHandler(request, h) {
    try {
      this._validator.validateCollaborationPayload(request.payload);
      const { id: credentialId } = request.auth.credentials;
      const { playlistId, userId } = request.payload;

      await this._userServices.verifyUserId(userId);

      await this._playlistService.verifyPlaylistOwner(playlistId, credentialId);

      // eslint-disable-next-line max-len
      const collaborationId = await this._collaborationsService.addCollaboration(playlistId, userId);

      const response = h.response({
        status: 'success',
        message: 'Kolaborasi berhasil ditambahkan',
        data: {
          collaborationId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      return errorResponse(h, error);
    }
  }

  async deleteCollaborationHandler(request, h) {
    try {
      this._validator.validateCollaborationPayload(request.payload);
      const { id: credentialId } = request.auth.credentials;
      const { playlistId, userId } = request.payload;

      await this._playlistService.verifyPlaylistOwner(playlistId, credentialId);

      await this._collaborationsService.deleteCollaboration(playlistId, userId);

      return {
        status: 'success',
        message: 'Kolaborasi berhasil dihapus',
      };
    } catch (error) {
      return errorResponse(h, error);
    }
  }
}

module.exports = CollaborationsHandler;
