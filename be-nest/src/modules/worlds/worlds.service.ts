import { Injectable } from '@nestjs/common';
import { CreateWorldDto } from './dto/create-world.dto';
import { UpdateWorldDto } from './dto/update-world.dto';
import { AbstractService } from 'abstracts'
import { World } from './worlds.schema'
import { InjectModel } from '@nestjs/mongoose'
import { COLLECTION } from 'enums'
import { Model } from 'mongoose'

@Injectable()
export class WorldsService extends AbstractService<World> {
  constructor(@InjectModel(COLLECTION.worlds) model : Model<World> ){
    super(model)
  }
  create(createWorldDto: CreateWorldDto) {
    return this.model.create(createWorldDto)
  }

  findAll() {
    return `This action returns all worlds`;
  }

  update(id: number, updateWorldDto: UpdateWorldDto) {
    return `This action updates a #${id} world`;
  }

  remove(id: number) {
    return `This action removes a #${id} world`;
  }
}
