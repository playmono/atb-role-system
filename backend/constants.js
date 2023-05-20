import { config } from "dotenv";

config();

export const APP_PORT = process.env.APP_PORT;
export const DB_NAME = 'database/' + process.env.DB_NAME;