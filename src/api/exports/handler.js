const PlaylistsService = require('../../services/postgres/PlaylistsService');
const ProducerService = require('../../services/rabbitmq/ProducerService');
const errorResponse = require('../../utils/errorResponse');
const ExportsValidator = require('../../validator/exports');

class ExportsHandler {
  constructor() {
    this._validator = ExportsValidator;
    this._producerService = ProducerService;
    this._playlistService = new PlaylistsService();

    this.postExportPlaylistHandler = this.postExportPlaylistHandler.bind(this);
  }

  async postExportPlaylistHandler(request, h) {
    try {
      this._validator.validateExportNotesPayload(request.payload);
      const { id: credentialId } = request.auth.credentials;
      const { id: playlistId } = request.params;

      await this._playlistService.verifyPlaylistAccess(playlistId, credentialId);

      const message = {
        userId: credentialId,
        targetEmail: request.payload.targetEmail,
      };

      await this._producerService.sendMessage('export:playlists', JSON.stringify(message));

      const response = h.response({
        status: 'success',
        message: 'Permintaan Anda dalam antrean',
      });
      response.code(201);
      return response;
    } catch (error) {
      return errorResponse(h, error);
    }
  }
}

module.exports = ExportsHandler;
