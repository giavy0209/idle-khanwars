import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WorldsService } from './worlds.service';
import { CreateWorldDto } from './dto/create-world.dto';
import { UpdateWorldDto } from './dto/update-world.dto';
import { ApiTags } from '@nestjs/swagger'
import { Public } from 'decorators'
import { ROUTER } from 'enums'

@Controller(ROUTER.worlds)
@ApiTags('Worlds')
@Public()
export class WorldsController {
  constructor(private readonly worldsService: WorldsService) {}

  @Post()
  create(@Body() createWorldDto: CreateWorldDto) {
    return this.worldsService.create(createWorldDto);
  }

  @Get()
  findAll() {
    return this.worldsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.worldsService.findOne({_id : id});
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWorldDto: UpdateWorldDto) {
    return this.worldsService.update(+id, updateWorldDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.worldsService.remove(+id);
  }
}
