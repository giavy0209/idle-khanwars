import { Inject, Injectable, Scope } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { InjectConnection } from '@nestjs/mongoose'
import { AbstractService } from 'abstracts'
import { COLLECTION } from 'enums'
import { Request } from 'express'
import { Connection } from 'mongoose'
import { CreateUserDto } from './dto'
import { User } from './user.schema'

@Injectable({ scope: Scope.REQUEST })
export class UserService extends AbstractService<User> {
  constructor(
    @InjectConnection() connection : Connection,
    @Inject(REQUEST) req : Request
  ) {
    super(
      connection,
      User,
      COLLECTION.users,
      req.user.tenant,
    )
  }
  async create(createUserDto: CreateUserDto) {
    const createdUser = await this.model.create(createUserDto)
    return createdUser
  }

}
