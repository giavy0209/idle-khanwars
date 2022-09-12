import { Document, Types } from "mongoose"

export default interface IUser extends Document{
    username : string
    password : string,
    tenant : string
    lastLogin : Date,
    world : Types.ObjectId
}