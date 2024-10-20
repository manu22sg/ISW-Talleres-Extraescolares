"use strict";
import { fileURLToPath } from "url";
import path from "path";
import dotenv from "dotenv";

const _filename = fileURLToPath(import.meta.url);

const _dirname = path.dirname(_filename);

const envFilePath = path.resolve(_dirname, ".env.example");

dotenv.config({ path: envFilePath });

export const PORT = process.env.PORT;
export const HOST = process.env.HOST || "localhost";
export const DB_USERNAME = process.env.DB_USERNAME || "mgalvez";
export const PASSWORD = process.env.PASSWORD || "0104";
export const DATABASE = process.env.DATABASE || "inscripcion";
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "secret";
export const cookieKey = process.env.cookieKey;
