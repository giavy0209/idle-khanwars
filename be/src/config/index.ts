import dotenv from 'dotenv'
import { IUser, IWorld } from 'interfaces';
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

  namespace Express {
    export interface Request {
      controllerName?: string
      pagin: {
        skip: number,
        limit: number
      },
      user: IUser & {world : IWorld}
    }
  }
}

global.Config = {
  PORT: process.env.PORT || '',
  MONGO_HOST: process.env.MONGO_HOST || '',
  MONGO_PORT: process.env.MONGO_PORT || '',
  MONGO_USER: process.env.MONGO_USER || '',
  MONGO_PASSWORD: process.env.MONGO_PASSWORD || '',
  MONGO_DB: process.env.MONGO_DB || '',
  JWT_SECRET: process.env.JWT_SECRET || '',
}