const errorResponse = require('../../payload/response/errorResponse');
const UserServices = require('../../services/postgres/UsersService');
const UsersValidator = require('../../validator/users');

class UsersHandler {
  constructor() {
    this._usersService = new UserServices();
    this._validator = UsersValidator;

    this.postUserHandler = this.postUserHandler.bind(this);
  }

  async postUserHandler(request, h) {
    try {
      this._validator.validateUserPayload(request.payload);

      const { username, password, fullname } = request.payload;

      const userId = await this._usersService.addUser({ username, password, fullname });

      const response = h.response({
        status: 'success',
        message: 'User berhasil ditambahkan',
        data: {
          userId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      return errorResponse(h, error);
    }
  }
}

module.exports = UsersHandler;
