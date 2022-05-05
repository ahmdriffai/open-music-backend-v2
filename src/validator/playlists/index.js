const InvariantError = require('../../exception/InvariantError');
const PlaylistPayloadSchema = require('./schema');

const PlaylistsValidator = {
  validateplaylistPayload: (payload) => {
    const validationResult = PlaylistPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = PlaylistsValidator;
