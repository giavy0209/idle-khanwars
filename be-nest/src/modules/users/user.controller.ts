import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Res,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Public, QueryOptions } from 'decorators'
import { Response } from 'express'
import { CreateUserDto, QueryUserDto } from './dto'
import { UserService } from './user.service'
import { ROUTER } from 'enums'

@ApiTags('Users')
@Controller(ROUTER.users)
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Public()
  @Post()
  async create(@Res() res: Response, @Body() createUserDto: CreateUserDto) {
    const data = await this.userService.create(createUserDto)
    res.send(data)
  }

  @Public()
  @Get()
  async findAll(
    @Query() query: QueryUserDto,
    @QueryOptions() queryOptions: QueryParams
  ) {
    return this.userService.find({
      query,
      ...queryOptions
    })
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.userService.findById(id)
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.userService.delete(id)
  }
}
