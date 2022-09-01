/** @format */

import { Module } from '@nestjs/common';
import { ModelModule } from '@vypham0209/nestjs-common';
import { Building } from 'modules/building/building.schema';
import { CastleModule } from 'modules/castle/castle.module';
import { DefaultUnitModule } from 'modules/default-unit/default-unit.module';
import { DefaultUpgradeModule } from 'modules/default-upgrade/default-upgrade.module';
import { ResourceModule } from 'modules/resource/resource.module';
import { SocketModule } from 'modules/socket/socket.module';
import { Unit } from 'modules/unit/unit.schema';
import { TrainingHandlerService } from './training-handler.service';
import { TrainingController } from './training.controller';
import { Training } from './training.schema';
import { TrainingService } from './training.service';

@Module({
  imports: [
    ModelModule.register([Training, Unit]),
    ModelModule.registerWithoutRequest([Training, Unit, Building]),
    ResourceModule,
    CastleModule,
    SocketModule,
    DefaultUnitModule,
    DefaultUpgradeModule,
  ],
  controllers: [TrainingController],
  providers: [TrainingService, TrainingHandlerService],
  exports: [TrainingService, TrainingHandlerService],
})
export class TrainingModule {}
