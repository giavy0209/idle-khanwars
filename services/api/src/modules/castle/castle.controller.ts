import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CONTROLLER } from 'enum/controller.enum';
import { CastleService } from './castle.service';
import { GetMapDto } from './dto/get-map.dto';
import { PlaceCastleDto } from './dto/place-castle.dto';

@Controller(CONTROLLER.CASTLE)
export class CastleController {
  constructor(private castleService: CastleService) {}
  @Get()
  async get() {
    const data = await this.castleService.get();
    return {
      data,
      message: 'Get castle successfully',
    };
  }

  @Get('detail/:id')
  async getDetail(@Param('id') id: string) {
    const data = await this.castleService.getDetail(id);
    return {
      data,
      message: 'Get castle detail successfully',
    };
  }

  @Get('map')
  async getMap(@Query() query: GetMapDto) {
    const data = await this.castleService.getMap(query);
    return {
      data,
      message: 'Get map successfully',
    };
  }

  @Post('')
  async placeCastle(@Body() body: PlaceCastleDto) {
    await this.castleService.placeCastle(body);
    return {
      message: 'Create castle successfully',
    };
  }
}
