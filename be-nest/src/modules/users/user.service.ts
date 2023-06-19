import { Injectable, Scope } from '@nestjs/common'
import { AbstractService } from 'abstracts'
import { CreateUserDto } from './dto'
import { UserModel } from './user.schema'

@Injectable({ scope: Scope.REQUEST })
export class UserService extends AbstractService<UserModel> {
  constructor(model:UserModel) {
    super(model)
  }
  async create(createUserDto: CreateUserDto) {
    const createdUser = await this.model.create(createUserDto)
    return createdUser
  }

}
