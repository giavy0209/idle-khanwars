import { Inject, Injectable, Scope } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { InjectModel } from '@nestjs/mongoose'
import { AbstractService } from 'abstracts'
import { COLLECTION } from 'enums'
import { Request } from 'express'
import { Model } from 'mongoose'
import { CreateUserDto } from './dto'
import { User } from './user.schema'

@Injectable({ scope: Scope.REQUEST })
export class UserService extends AbstractService<User> {
  constructor(@InjectModel(COLLECTION.users) userModel: Model<User>, @Inject(REQUEST) req : Request) {
    super(userModel)
  }

  async create(createUserDto: CreateUserDto) {
    const createdUser = await this.model.create(createUserDto)
    return createdUser
  }

  async delete(id: string) {
    const deletedUser = await this.model.findByIdAndRemove(id)
    return deletedUser
  }
}
