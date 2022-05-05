const InvariantError = require('../../exception/InvariantError');
const CollaborationPayloadSchema = require('./schema');

const UsersValidator = {
  validateUserPayload: (payload) => {
    const validationResult = CollaborationPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = UsersValidator;
