import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';

const envFile = `.env.${process.env.NODE_ENV || 'development'}.local`;
const envPath = path.resolve(process.cwd(), envFile);

if (!fs.existsSync(envPath)) {
    console.log(`Error: Missing ${envPath}. Copy ".env.example" to "${envFile}" and fill in correct env variables`);
    process.exit(1);
}

config({ path: envPath });

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const { NODE_ENV, PORT, LOG_LEVEL, DB_NAME, DB_HOST, DB_USER, DB_PORT, DB_PASSWORD, OPEN_WEATHER_KEY } = process.env;
