const SongsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'songs',
  version: '1.0.0',
  register: async (server) => {
    const songsHandler = new SongsHandler();
    server.route(routes(songsHandler));
  },
};
