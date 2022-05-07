require('dotenv').config();

const Jwt = require('@hapi/jwt');
const Hapi = require('@hapi/hapi');
const albums = require('./api/albums');
const authenticatios = require('./api/authenticatios');
const songs = require('./api/songs');
const users = require('./api/users');
const playlists = require('./api/playlists');
const playlistSongs = require('./api/playlistSongs');
const collaborations = require('./api/collaborations');

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  // mendefinisikan strategy autentikasi jwt
  server.auth.strategy('openmusic_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: albums,
    },
    {
      plugin: songs,
    },
    {
      plugin: users,
    },
    {
      plugin: authenticatios,
    },
    {
      plugin: playlists,
    },
    {
      plugin: playlistSongs,
    },
    {
      plugin: collaborations,
    },
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
