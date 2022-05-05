const PlaylistSongsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlistSongs',
  version: '1.0.0',
  register: async (server) => {
    const playlistSongHandler = new PlaylistSongsHandler();
    server.route(routes(playlistSongHandler));
  },
};
