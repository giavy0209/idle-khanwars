/** @format */

import { Module } from '@nestjs/common';
import { ModelModule } from '@vypham0209/nestjs-common';
import { DefaultResource } from 'modules/default-resource/default-resource.schema';
import { DefaultUpgradeModule } from 'modules/default-upgrade/default-upgrade.module';
import { DefaultBuilding } from './default-building.schema';
import { DefaultBuildingService } from './default-building.service';

@Module({
  imports: [
    ModelModule.registerWithoutRequest([DefaultBuilding, DefaultResource]),
    DefaultUpgradeModule,
  ],
  providers: [DefaultBuildingService],
  exports: [DefaultBuildingService],
})
export class DefaultBuildingModule {}
