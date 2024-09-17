import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import logger from './utils/logger';
import Recipe from "./models/Recipe";

dotenv.config();

class DataBase {
    public sequelize: Sequelize | null = null;

    private POSTGRES_DB = String(process.env.POSTGRES_DB);
    private POSTGRES_USER = String(process.env.POSTGRES_USER);
    private POSTGRES_PASSWORD = String(process.env.POSTGRES_PASSWORD);
    private POSTGRES_PORT = Number(process.env.POSTGRES_PORT);
    private POSTGRES_HOST = String(process.env.POSTGRES_HOST);

    constructor() {
        if (process.env.NODE_ENV !== 'test') {
            this.sequelize = new Sequelize({
                database: this.POSTGRES_DB,
                username: this.POSTGRES_USER,
                password: this.POSTGRES_PASSWORD,
                host: this.POSTGRES_HOST,
                port: this.POSTGRES_PORT,
                dialect: 'postgres',
            });

            this.connectToDb();
            this.initializeModels();
        } else {
            logger.info('Skipping database initialization in test environment');
        }
    }

    private async connectToDb() {
        try {
            if (this.sequelize) {
                await this.sequelize.authenticate();
                logger.info('Connected to Database');
            }
        } catch (err) {
            logger.error('Unable to connect to Database... Error:', err);
        }
    }

    private initializeModels() {
        if (this.sequelize) {
            Recipe.initModel(this.sequelize); // Initialize Recipe model

            this.defineRelationships();
        }
    }

    private defineRelationships() {
        if (this.sequelize) {
            // Add relations here if any
            // Sync the database after initializing models
            this.sequelize
                .sync({ alter: true })
                .then(() => {
                    logger.info('Database synchronized');
                })
                .catch(error => {
                    logger.error('Error synchronizing database:', error);
                });
        }
    }

}

export default DataBase;
