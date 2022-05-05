const InvariantError = require('../../exception/InvariantError');
const PlaylistSongPayloadSchema = require('./schema');

const PlaylistSongsValidator = {
  validateplaylistPayload: (payload) => {
    const validationResult = PlaylistSongPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = PlaylistSongsValidator;
