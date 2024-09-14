import 'reflect-metadata';
import { config } from './common/config';
import Server from './common/config/server';
import http from 'http';
import connect from './common/config/database';

const startServer = async () => {
  // create server
  const server = new Server();

  const app = server.getServer().build();

  const httpServer = http.createServer(app);

  httpServer.on('listening', async () => {
    await connect()
    console.info(`Service listening for connections on port: ${config.PORT}`);
  });

  httpServer.listen(+config.PORT);

  return httpServer;
};

startServer();
