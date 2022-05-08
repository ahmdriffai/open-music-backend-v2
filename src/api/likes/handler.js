const LikesService = require('../../services/postgres/LikesService');
const errorResponse = require('../../utils/errorResponse');

class LikesHandler {
  constructor() {
    this._likesService = new LikesService();

    this.postLikeAlbumHandler = this.postLikeAlbumHandler.bind(this);
    this.getLikeAlbumHandler = this.getLikeAlbumHandler.bind(this);
  }

  async postLikeAlbumHandler(request, h) {
    try {
      const { id: credentialId } = request.auth.credentials;
      const { id } = request.params;

      await this._likesService.verifyAlbumLike(id, credentialId);

      const message = await this._likesService.addLike(credentialId, id);

      const response = h.response({
        status: 'success',
        message,
      });
      response.code(201);
      return response;
    } catch (error) {
      return errorResponse(h, error);
    }
  }

  async getLikeAlbumHandler(request, h) {
    try {
      const { id } = request.params;

      const likes = await this._likesService.getLikes(id);

      const respone = h.response({
        status: 'success',
        data: {
          likes: likes.likes,
        },
      });

      if (likes.isChace) {
        respone.header('X-Data-Source', 'cache');
      }

      return respone;
    } catch (error) {
      return errorResponse(h, error);
    }
  }
}

module.exports = LikesHandler;
