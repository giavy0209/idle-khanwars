import dotenv from 'dotenv'
import { IUserFullyPopulate } from 'interfaces/IUser';
import { Connection } from 'mongoose';
dotenv.config({ path: '.env.dev' })
declare global {
  var Config: {
    PORT: string,
    MONGO_HOST: string,
    MONGO_PORT: string,
    MONGO_USER: string,
    MONGO_PASSWORD: string,
    MONGO_DB: string,
    JWT_SECRET: string,
  };
  function getDbName(tenant?: string): string
  var DB: {
    [k: string]: Connection
  }

  namespace Express {
    export interface Request {
      controllerName?: string
      pagin: {
        skip: number,
        limit: number
      },
      user: IUserFullyPopulate
    }
  }
}

global.DB = {}

global.Config = {
  PORT: process.env.PORT || '',
  MONGO_HOST: process.env.MONGO_HOST || '',
  MONGO_PORT: process.env.MONGO_PORT || '',
  MONGO_USER: process.env.MONGO_USER || '',
  MONGO_PASSWORD: process.env.MONGO_PASSWORD || '',
  MONGO_DB: process.env.MONGO_DB || '',
  JWT_SECRET: process.env.JWT_SECRET || '',
}
global.getDbName = (tenant: string) => {
  if (tenant) return `${tenant}_${Config.MONGO_DB}`
  return Config.MONGO_DB
}