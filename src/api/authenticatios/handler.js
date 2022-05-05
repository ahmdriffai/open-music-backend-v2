const errorResponse = require('../../payload/response/errorResponse');
const UserServices = require('../../services/postgres/UsersService');
const TokenManager = require('../../tokenize/TokenManager');
const AuthenticationsValidator = require('../../validator/authenticatios');

class AuthenticationsHandler {
  constructor() {
    this._validator = AuthenticationsValidator;
    this._usersService = new UserServices();
    this._tokenManager = TokenManager;

    this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
  }

  async postAuthenticationHandler(request, h) {
    try {
      this._validator.validatePostAutenticationPayload(request.payload);

      const { username, password } = request.payload;

      const id = await this._usersService.verifyUserCredential(username, password);

      const accessToken = this._tokenManager.genereteAccessToken({ id });
      const refreshToken = this._tokenManager.genereteRefreshToken({ id });

      const response = h.response({
        status: 'success',
        message: 'Authentication berhasil ditambahkan',
        data: {
          accessToken,
          refreshToken,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      return errorResponse(h, error);
    }
  }
}

module.exports = AuthenticationsHandler;
