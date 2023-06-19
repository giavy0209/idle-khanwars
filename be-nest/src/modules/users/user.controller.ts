import {
  Body,
  Controller,
  Post
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Public } from 'decorators'
import { ROUTER } from 'enums'
import { CreateUserDto } from './dto'
import { UserService } from './user.service'

@ApiTags('Users')
@Controller(ROUTER.users)
export class UserController {
  constructor(private readonly service: UserService) { }

  @Public()
  @Post('signup')
  async create(@Body() createUserDto: CreateUserDto) {
    const data = await this.service.create(createUserDto)
    return data
  }
}
