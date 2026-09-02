import app from './app.js';
import { connectDatabase } from './config/database.js';
import { env, EnvironmentConfigurationError } from './config/env.js';

const startServer = async (): Promise<void> => {
    try {
        await connectDatabase();

        app.listen(env.port, () => {
            console.log(`API is listening on port ${env.port}.`);
        });
    } catch (error) {
        if (error instanceof EnvironmentConfigurationError) {
            console.error(error.message);
            process.exit(1);
        }

        console.error('Failed to connect to MongoDB. The server was not started.');
        process.exit(1);
    }
};

void startServer();
