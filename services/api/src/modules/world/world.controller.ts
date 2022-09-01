/** @format */

import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import {
  Public,
  QueryOptionDto,
  QueryOptions,
} from '@vypham0209/nestjs-common';
import { CONTROLLER } from 'enum/controller.enum';
import { PostWorldDto } from './dto/post-world.dto';
import { WorldService } from './world.service';

@Controller(CONTROLLER.WORLD)
@ApiTags('World api')
export class WorldController {
  constructor(private service: WorldService) {}

  @Public()
  @Get()
  @ApiQuery({ type: QueryOptionDto })
  async get(@QueryOptions() queryParams: QueryParams) {
    const data = await this.service.get(queryParams);
    return {
      data,
      message: 'Get world successfully',
    };
  }
  @Public()
  @Post()
  async post(@Body() body: PostWorldDto) {
    const data = await this.service.post(body);
    return {
      data,
      message: 'Create world successfully',
    };
  }
}
