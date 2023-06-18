import { Schema as NestSchema, Prop, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'
import { HydratedDocument} from 'mongoose'

@NestSchema({
  timestamps: true,
})
export class User {
  @ApiProperty({example : 'user1'})
  @IsString({message : 'Username is not valid'})
  @Prop({type : String, unique : true})
  username : string
}
export const UserSchema = SchemaFactory.createForClass(User)

export type UserDocument = HydratedDocument<User>
