import * as dotenv from "dotenv";
dotenv.config();
import { z } from "zod";

const envVarsSchema = z.object({
  MODE: z.union([z.literal("prod"), z.literal("dev"), z.literal("staging")]),
  PORT: z.string().default("80").transform((str) => parseInt(str, 10)),  
  DB_URL: z.string(),
  JWT_SECRET:z.string(),
  SALT:z.string()
});

const envVars = envVarsSchema.parse(process.env);
const isDev = envVars.MODE === "dev";
const isProd = envVars.MODE === "prod";
const isStaging = envVars.MODE === "staging";

export const envConfigs = {
  env: envVars.MODE,
  isDev: envVars.MODE === "dev",
  port: envVars.PORT || 8080,
  jwt_secret:envVars.JWT_SECRET,
  db: {
    url: envVars.DB_URL,
    
  },
  salt:envVars.SALT
};

