import { Schema as NestSchema, Prop } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsString } from 'class-validator'
import { STATUS } from 'enums'
import { Document, HydratedDocument } from 'mongoose'

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

export type WorldDocument = HydratedDocument<World>
