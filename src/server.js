require('dotenv').config();

const Hapi = require('@hapi/hapi');
const albums = require('./api/albums');
const authenticatios = require('./api/authenticatios');
const songs = require('./api/songs');
const users = require('./api/users');

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
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
