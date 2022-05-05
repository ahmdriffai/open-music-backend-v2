const Jwt = require('@hapi/jwt');
const InvariantError = require('../exception/InvariantError');

const TokenManager = {
  genereteAccessToken: (payload) => Jwt.token.generate(payload, process.env.ACCESS_TOKEN_KEY),
  genereteRefreshToken: (payload) => Jwt.token.generate(payload, process.env.REFRESH_TOKEN_KEY),
  verifyRefreshToken: (refreshToken) => {
    try {
      const artifact = Jwt.token.decode(refreshToken);
      Jwt.token.verifySignature(artifact, process.env.REFRESH_TOKEN_KEY);

      const { payload } = artifact.decoded;
      return payload;
    } catch (error) {
      throw new InvariantError('Refresh token tidak valid');
    }
  },
};

module.exports = TokenManager;
