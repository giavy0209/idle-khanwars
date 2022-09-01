/** @format */

import { Module } from '@nestjs/common';
import { ModelModule } from '@vypham0209/nestjs-common';
import { Building } from 'modules/building/building.schema';
import { DefaultEnhanceModule } from 'modules/default-enhance/default-enhance.module';
import { DefaultUnitModule } from 'modules/default-unit/default-unit.module';
import { UnitController } from './unit.controller';
import { Unit } from './unit.schema';
import { UnitService } from './unit.service';

@Module({
  imports: [
    ModelModule.register([Building, Unit]),
    DefaultUnitModule,
    DefaultEnhanceModule,
  ],
  controllers: [UnitController],
  providers: [UnitService],
  exports: [UnitService],
})
export class UnitModule {}
