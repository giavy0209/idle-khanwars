import { Controller, Delete, Param, Post } from '@nestjs/common';
import { CONTROLLER } from 'enum/controller.enum';
import { UpgradeService } from './upgrade.service';

@Controller(CONTROLLER.UPGRADE)
export class UpgradeController {
  constructor(private readonly upgradeService: UpgradeService) {}
  @Post('building/:id')
  async post(@Param('id') buildingId: string) {
    await this.upgradeService.post(buildingId);
    return {
      message: 'Upgrade successfully',
    };
  }

  @Delete(':id')
  async delete(@Param('id') upgradeId: string) {
    await this.upgradeService.delete(upgradeId);
    return {
      message: 'Cancel upgrade successfully',
    };
  }
}
