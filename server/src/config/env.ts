import 'dotenv/config';

export class EnvironmentConfigurationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'EnvironmentConfigurationError';
    }
}

export const env = {
    get mongodbUri(): string {
        const value = process.env.MONGODB_URI?.trim();

        if (!value) {
            throw new EnvironmentConfigurationError('Missing required MONGODB_URI environment variable.');
        }

        return value;
    },
    port: process.env.PORT?.trim() || '3001',
};
