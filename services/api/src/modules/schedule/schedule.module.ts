/** @format */

import { Module } from '@nestjs/common';
import { CronModule, ModelModule } from '@vypham0209/nestjs-common';
import { Building } from 'modules/building/building.schema';
import { Castle } from 'modules/castle/castle.schema';
import { DefaultUnitModule } from 'modules/default-unit/default-unit.module';
import { DefaultUpgradeModule } from 'modules/default-upgrade/default-upgrade.module';
import { Resource } from 'modules/resource/resource.schema';
import { SocketModule } from 'modules/socket/socket.module';
import { Training } from 'modules/training/training.schema';
import { Unit } from 'modules/unit/unit.schema';
import { ScheduleService } from './schedule.service';

@Module({
  imports: [
    ModelModule.registerWithoutRequest([
      Resource,
      Castle,
      Training,
      Unit,
      Building,
    ]),
    CronModule,
    SocketModule,
    DefaultUnitModule,
    DefaultUpgradeModule,
  ],
  providers: [ScheduleService],
  exports: [ScheduleService],
})
export class ScheduleModule {}
