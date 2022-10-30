import { Document } from "mongoose";

export interface IEnhance extends Document {
  type: 'HP' | 'ATTACK'
  level: number
  percent: number
}