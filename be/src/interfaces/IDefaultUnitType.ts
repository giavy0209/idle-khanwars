import { Document} from "mongoose";

export default interface IDefaultUnitType extends Document {
  name : string
  key : string
  order : number
}