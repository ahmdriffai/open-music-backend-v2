const errorResponse = require('../../utils/errorResponse');
const StorageService = require('../../services/S3/StorageService');
const AlbumsService = require('../../services/postgres/AlbumsService');
const UploadsValidator = require('../../validator/uploads');

class UploadsHandler {
  constructor() {
    this._validator = UploadsValidator;
    this._storageService = new StorageService();
    this._albumsService = new AlbumsService();
    this.postUploadAlbumCoverHandler = this.postUploadAlbumCoverHandler.bind(this);
  }

  async postUploadAlbumCoverHandler(request, h) {
    try {
      const { cover } = request.payload;
      this._validator.validateImageHeader(cover.hapi.headers);

      const { id: albumId } = request.params;

      const fileLocation = await this._storageService.writeFile(cover, cover.hapi);

      this._albumsService.uploadCoverAlbum(albumId, fileLocation);

      const response = h.response({
        status: 'success',
        message: 'Sampul berhasil diunggah',
      });
      response.code(201);
      return response;
    } catch (error) {
      return errorResponse(h, error);
    }
  }
}

module.exports = UploadsHandler;
