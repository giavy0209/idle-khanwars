import { Inject } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { InjectConnection, Schema as NestSchema, Prop, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { AbstractModel } from 'abstracts/AbstractModel'
import { IsNumber, IsString } from 'class-validator'
import { COLLECTION, STATUS } from 'enums'
import { Request } from 'express'
import { Connection, Document, HydratedDocument } from 'mongoose'

@NestSchema({
  timestamps: true,
})
export class World extends Document{
  @ApiProperty({ example: 'World 1' })
  @IsString({ message: 'World name is not valid' })
  @Prop({ type: String , index : 'text'})
  name: string

  @ApiProperty({ example: "1" })
  @IsString({ message: 'Tenant Id must be string' })
  @Prop({ type: String, unique: true })
  tenant: string

  @ApiProperty({ example: 1 })
  @IsNumber({}, { message: 'Speed of world must be number' })
  @Prop({ type: Number, required: [true, "Speed of world must be define"] })
  speed: number

  @Prop({ type: String, enum: Object.values(STATUS), default: STATUS.ACTIVE })
  status: STATUS
}
export const WorldSchema = SchemaFactory.createForClass(World)

export type WorldDocument = HydratedDocument<World>

export class WorldModel extends AbstractModel<World> {
  constructor(
    @InjectConnection() connection : Connection,
    @Inject(REQUEST) req : Request
  ) {
    super(
      connection,
      {
        name : COLLECTION.worlds,
        schema : WorldSchema,
        tenant: req.tenantId
      }
    )
  }
}