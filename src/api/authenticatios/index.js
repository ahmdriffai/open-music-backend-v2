const AuthenticationsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'authentications',
  version: '1.0.0',
  register: async (server) => {
    const authenticationsHandler = new AuthenticationsHandler();
    server.route(routes(authenticationsHandler));
  },
};
