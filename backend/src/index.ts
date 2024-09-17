import dotenv from 'dotenv';
import logger from './utils/logger';
import App from './app';

dotenv.config();

const port = process.env.PORT || 3001;
const app = new App().app;

app.listen(port, () => {
    logger.info(`Server running on port ${port}`);
});
