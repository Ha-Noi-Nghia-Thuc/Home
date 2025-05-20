// Môi trường
export const NODE_ENV = process.env.NODE_ENV || "development";
export const IS_PRODUCTION = NODE_ENV === "production";
export const IS_DEVELOPMENT = NODE_ENV === "development";
export const IS_TEST = NODE_ENV === "test";

// Server
export const PORT = Number(process.env.PORT) || 5000;
export const API_PREFIX = process.env.API_PREFIX || "/api";
export const API_VERSION = process.env.API_VERSION || "v1";

// Cấu hình CORS
export const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["http://localhost:3000"];

// Cấu hình JWT
export const JWT_SECRET = process.env.JWT_SECRET || "JWT_SECRET";

// Cấu hình S3
export const S3 = {
  BUCKET: process.env.S3_BUCKET || "",
  REGION: process.env.S3_REGION || "us-east-1",
  ACCESS_KEY: process.env.S3_ACCESS_KEY || "",
  SECRET_KEY: process.env.S3_SECRET_KEY || "",
};

// Cấu hình database
export const DATABASE_URL = process.env.DATABASE_URL || "";

// Cấu hình logging
export const LOG_FORMAT = IS_PRODUCTION ? "combined" : "dev";
export const LOG_DIR = process.env.LOG_DIR || "../logs";

export default {
  NODE_ENV,
  IS_PRODUCTION,
  IS_DEVELOPMENT,
  IS_TEST,
  PORT,
  API_PREFIX,
  API_VERSION,
  ALLOWED_ORIGINS,
  JWT_SECRET,
  S3,
  DATABASE_URL,
  LOG_FORMAT,
  LOG_DIR,
};
