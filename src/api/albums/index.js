const AlbumsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'albums',
  version: '1.0.0',
  register: async (server) => {
    const albumHandler = new AlbumsHandler();
    server.route(routes(albumHandler));
  },
};
