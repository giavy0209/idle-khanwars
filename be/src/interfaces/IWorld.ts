import { Document } from "mongoose"

export default interface IWorld extends Document{
    name : string,
    tenant : string,
    speed : number
}