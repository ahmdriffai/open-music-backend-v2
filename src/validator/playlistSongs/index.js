const { PostPlaylistSongPayloadSchema, DeletePlaylistSongPayloadSchema } = require('./schema');
const InvariantError = require('../../exception/InvariantError');

const PlaylistSongsValidator = {
  validatePostPlaylistPayload: (payload) => {
    const validationResult = PostPlaylistSongPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateDeletePlaylistPayload: (payload) => {
    const validationResult = DeletePlaylistSongPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = PlaylistSongsValidator;
