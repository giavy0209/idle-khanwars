import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { COLLECTION } from 'enums'
import { UserController } from './user.controller'
import { User, UserSchema } from './user.schema'
import { UserService } from './user.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name : COLLECTION.users,
        schema : UserSchema
      }
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, User],
})
export class UserModule {}
