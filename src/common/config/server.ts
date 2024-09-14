import container from './di';
import 'reflect-metadata';
import { InversifyExpressServer } from 'inversify-express-utils';
import cors from 'cors';
import express from 'express';
// import helmet from 'helmet';
import authMiddleware from '../middlewares/auth.middleware';
import { trim_all } from '../middlewares/trim.middleware';


export default class Server {
    private readonly server: InversifyExpressServer;

    constructor() {
        this.server = new InversifyExpressServer(container, null, {
            rootPath: '',
        });

        process.on('unhandledRejection', (err) => {
            console.error('unhandledRejection', err);
        });

        this.server.setConfig((app) => {

            app.use(express.json());
            app.use(cors());
            // app.use(helmet());
            app.use(
                express.urlencoded({
                    extended: true,
                    limit: '20mb',
                })
            );
            app.use(express.text({ limit: '20mb' }));
            app.use(
                express.json({
                    type: 'application/vnd.api+json',
                    limit: '20mb',
                })
            );
            app.use(trim_all);
            app.disable('x-powered-by');
            app.use(authMiddleware);
            
        });

        // this.server.setErrorConfig((app) => {
        //     app.use(errorHandler);
        //     app.use(invalidPathHandler);
        // });

    }

    getServer(): InversifyExpressServer {
        return this.server;
    }
}
