import { setServers } from 'node:dns';
import { resolveSrv } from 'node:dns/promises';
import mongoose from 'mongoose';
import { env } from './env.js';

const PUBLIC_DNS_SERVERS = ['1.1.1.1', '8.8.8.8'];
const RETRYABLE_DNS_ERRORS = new Set(['ECONNREFUSED', 'ETIMEOUT', 'ESERVFAIL']);

const configureDnsFallback = async (uri: string): Promise<void> => {
    const parsedUri = new URL(uri);

    if (parsedUri.protocol !== 'mongodb+srv:') return;

    try {
        await resolveSrv(`_mongodb._tcp.${parsedUri.hostname}`);
    } catch (error) {
        const errorCode = (error as NodeJS.ErrnoException).code;

        if (!errorCode || !RETRYABLE_DNS_ERRORS.has(errorCode)) throw error;

        setServers(PUBLIC_DNS_SERVERS);
        console.warn('System DNS unavailable. Using public DNS fallback.');
    }
};

export const connectDatabase = async (): Promise<void> => {
    const mongodbUri = env.mongodbUri;

    await configureDnsFallback(mongodbUri);
    await mongoose.connect(mongodbUri);
    console.log('Connected to MongoDB.');
};
