import { config } from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
config({
  path: fs.existsSync(path.join(process.cwd(), '.env'))
    ? path.join(process.cwd(), '.env')
    : path.join(process.cwd(), '.env.example'),
});

const envConfig = {
  PORT: process.env.PORT || '',
  NODE_ENV: process.env.NODE_ENV || '',
  JWT_SECRET: process.env.JWT_SECRET || '',
  MONGODB_URI: process.env.MONGODB_URI || '',
  MONGODB_NAME: process.env.MONGODB_NAME || '',
  APP_CONTEXT: process.env.APP_CONTEXT || '',
};

type ConfigType = typeof envConfig;

// Extend the global namespace
declare global {
  // eslint-disable-next-line no-var
  var Config: ConfigType;
}

// Assign the value
global.Config = envConfig;
export {};
