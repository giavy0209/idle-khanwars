import { Inject } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { InjectConnection, Schema as NestSchema, Prop, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { AbstractModel } from 'abstracts/AbstractModel'
import { IsMongoId, IsString } from 'class-validator'
import { COLLECTION } from 'enums'
import { Request } from 'express'
import { Connection, HydratedDocument, Schema, Types } from 'mongoose'

@NestSchema({
  timestamps: true,
})
export class User  {
  @ApiProperty({ example: 'user1' })
  @IsString({ message: 'Username is not valid' })
  @Prop({ type: String, unique: true })
  username: string

  @ApiProperty({ example: '123456' })
  @IsString({ message: 'Password must be string' })
  @Prop({ type: String })
  password: string

  @ApiProperty({ example: '6490bc40b5b5322e0c2d158c' })
  @IsMongoId({ message: 'World Id is not valid' })
  @Prop({ type: Schema.Types.ObjectId })
  world: Types.ObjectId

  @Prop({ type: Schema.Types.ObjectId })
  lastLogin: Date
}
export const UserSchema = SchemaFactory.createForClass(User)

export type UserDocument = HydratedDocument<User>

export class UserModel extends AbstractModel<User> {
  constructor(
    @InjectConnection() connection : Connection,
    @Inject(REQUEST) req : Request
  ) {
    super(
      connection,
      {
        name : COLLECTION.users,
        schema : UserSchema,
        tenant: req.tenantId
      }
    )
  }
}