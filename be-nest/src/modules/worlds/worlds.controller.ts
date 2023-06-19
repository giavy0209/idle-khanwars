import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Public, QueryOptions } from 'decorators'
import { ROUTER } from 'enums'
import { FilterQuery } from 'mongoose'
import { CreateWorldDto } from './dto/createWorld.dto'
import { queryWorldDto } from './dto/queryWorld.dto'
import { World } from './worlds.schema'
import { WorldsService } from './worlds.service'

@Controller(ROUTER.worlds)
@ApiTags('Worlds')
@Public()
export class WorldsController {
  constructor(private readonly service: WorldsService) { }

  @Post()
  create(@Body() createWorldDto: CreateWorldDto) {
    return this.service.create(createWorldDto)
  }

  @Get()
  findAll(
    @Query() { search }: queryWorldDto,
    @QueryOptions() { skip, limit, sort }: QueryParams
  ) {
    const query : FilterQuery<World> = {}
    if(search) {
      query.$text = {$search : search}
    }
    return this.service.find({
      query,
      skip,
      limit,
      sort
    })
  }
}
