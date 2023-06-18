import { Schema as NestSchema, Prop, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsString } from 'class-validator'
import { STATUS } from 'enums'
import { HydratedDocument } from 'mongoose'

@NestSchema({
  timestamps: true,
})
export class World {
  @ApiProperty({ example: 'World 1' })
  @IsString({ message: 'World name is not valid' })
  @Prop({ type: String })
  name: string

  @ApiProperty({ example: 1 })
  @IsString({ message: 'Tenant Id must be string' })
  @Prop({ type: String, unique: true })
  tenant: number

  @ApiProperty({ example: 1 })
  @IsNumber({}, { message: 'Speed of world must be number' })
  @Prop({ type: Number, required: [true, "Speed of world must be define"] })
  speed: number

  @Prop({ type: String, enum: Object.values(STATUS), default: STATUS.ACTIVE })
  status: STATUS
}
export const WorldSchema = SchemaFactory.createForClass(World)

export type WorldDocument = HydratedDocument<World>
