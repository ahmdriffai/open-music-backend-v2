const UploadsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'uploads',
  version: '1.0.0',
  register: async (server) => {
    const uploadsHandler = new UploadsHandler();
    server.route(routes(uploadsHandler));
  },
};
