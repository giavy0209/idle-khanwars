import { Module } from '@nestjs/common'
import { UserController } from './user.controller'
import { UserModel } from './user.schema'
import { UserService } from './user.service'

@Module({
  controllers: [UserController],
  providers: [UserService, UserModel],
})
export class UserModule {}
