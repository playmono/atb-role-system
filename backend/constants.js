import { config } from "dotenv";

config();

export const PORT = process.env.PORT;
export const DB_NAME = 'database/' + process.env.DB_NAME;
export const JWT_SECRET = process.env.JWT_SECRET;