/** @format */

import { Module } from '@nestjs/common';
import { ModelModule } from '@vypham0209/nestjs-common';
import { DefaultBuildingModule } from 'modules/default-building/default-building.module';
import { DefaultResourceModule } from 'modules/default-resource/default-resource.module';
import { DefaultUnitTypeModule } from 'modules/default-unit-type/default-unit-type.module';
import { DefaultUnitModule } from 'modules/default-unit/default-unit.module';
import { TrainingModule } from 'modules/training/training.module';
import { UpgradeModule } from 'modules/upgrade/upgrade.module';
import { WorldInitService } from './world-init.service';
import { WorldController } from './world.controller';
import { World } from './world.schema';
import { WorldService } from './world.service';

@Module({
  imports: [
    ModelModule.registerWithoutRequest([World]),
    DefaultResourceModule,
    DefaultBuildingModule,
    DefaultUnitTypeModule,
    DefaultUnitModule,
    TrainingModule,
    UpgradeModule,
  ],
  controllers: [WorldController],
  providers: [WorldService, WorldInitService],
  exports: [WorldService, WorldInitService],
})
export class WorldModule {}
