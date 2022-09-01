import { Controller, Get, Param } from '@nestjs/common';
import { CONTROLLER } from 'enum/controller.enum';
import { ResourceService } from './resource.service';

@Controller(CONTROLLER.RESOURCE)
export class ResourceController {
  constructor(private readonly resourceService: ResourceService) {}

  @Get('castle/:id')
  async getByCastle(@Param('id') id: string) {
    const data = await this.resourceService.getByCastle(id);
    return {
      data,
      message: 'Get resource successfully',
    };
  }
}
