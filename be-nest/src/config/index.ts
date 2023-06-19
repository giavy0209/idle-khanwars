import { config } from 'dotenv'
import * as fs from 'fs'
import { Expression, HydratedDocument, PipelineStage, Types, UnpackedIntersection } from 'mongoose'
import * as path from 'path'
import { IEnvironment } from './IEnvironment'
config({
  path: fs.existsSync(path.join(process.cwd(), '.env'))
    ? path.join(process.cwd(), '.env')
    : path.join(process.cwd(), '.env.example'),
})

declare module 'express' {
  export interface Request {
    tenantId: string
    strictPagination: {
      skip: number
      limit: number
    }
    sort?: {
      [k: string]: number
    }
    user: JWTPayload
    isAuthorization: boolean
  }
}
declare global {
  interface JWTPayload {
    name: string
    tenant: string
  }

  interface QueryParams {
    skip: number
    limit: number
    sort?:Record<string, 1 | -1 | Expression.Meta>
  }
  type StringOrObjectId = string | Types.ObjectId
  type MergePopulate<I, IP> = UnpackedIntersection<
    HydratedDocument<I, object, object>,
    IP
  >
  var Config: IEnvironment

  type RecursiveKeyOf<TObj> = {
    [TKey in keyof TObj & (string | number)]:
    TObj[TKey] extends any[] | Types.ObjectId ? `${TKey}` :
    TObj[TKey] extends object
    ? `${TKey}` | `${TKey}.${RecursiveKeyOf<TObj[TKey]>}`
    : `${TKey}`;
  }[keyof TObj & (string | number)];

  type GeneratePipeline<T = any> = {
    from: string,
    localField: RecursiveKeyOf<T>,
    foreignField?: string,
    as?: string
    lookup?: GeneratePipeline,
    unwind?: boolean,
    pipeline?: Exclude<PipelineStage, PipelineStage.Merge | PipelineStage.Out>[]
    keepNull?: boolean
    global?: boolean
  }[]
  interface Pagination {
    page: null | number,
    limit: null | number,
  }
}
global.Config = {
  CONTEXT:process.env.CONTEXT || '',
  PORT: process.env.PORT || '',
  NODE_ENV: process.env.NODE_ENV || '',

  JWT_SECRET: process.env.JWT_SECRET || '',

  MONGODB_URI: process.env.MONGODB_URI || '',
  MONGODB_NAME: process.env.MONGODB_NAME || '',
}
