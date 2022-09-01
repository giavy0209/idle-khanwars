/** @format */

import { Module } from '@nestjs/common';
import { ModelModule } from '@vypham0209/nestjs-common';
import { BuildingModule } from 'modules/building/building.module';
import { ResourceModule } from 'modules/resource/resource.module';
import { Training } from 'modules/training/training.schema';
import { UnitModule } from 'modules/unit/unit.module';
import { Unit } from 'modules/unit/unit.schema';
import { User } from 'modules/user/user.schema';
import { CastleController } from './castle.controller';
import { Castle } from './castle.schema';
import { CastleService } from './castle.service';

@Module({
  imports: [
    ModelModule.register([Unit, Castle, Training, User]),
    ModelModule.registerWithoutRequest([Castle]),
    BuildingModule,
    ResourceModule,
    UnitModule,
  ],
  controllers: [CastleController],
  providers: [CastleService],
  exports: [CastleService],
})
export class CastleModule {}
