import express, { Application } from 'express';
import routes from './routes';
import DataBase from './db';
import path from "path";
import logger from "./utils/logger";

class App {
    public app: Application;

    constructor() {
        this.app = express();
        this.setMiddlewares();
        this.setRoutes();
        this.syncDb();
    }

    protected setRoutes() {


        this.app.use('/api', routes);

    }

    protected syncDb() {
        if (process.env.NODE_ENV !== 'test') {
            new DataBase();
        } else {
            logger.info('Skipping database initialization in test environment');
        }
    }

    private setMiddlewares(): void {
        this.app.use('/uploads', (req, res, next) => {
            logger.debug(`Serving file: ${req.url}`);
            next();
        },
        express.static(path.resolve(__dirname, 'uploads')));

        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
    }
}

export default App;
