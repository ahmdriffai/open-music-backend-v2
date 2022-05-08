const LikesHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'likes',
  version: '1.0.0',
  register: async (server) => {
    const likesHandler = new LikesHandler();
    server.route(routes(likesHandler));
  },
};
