/** @format */

import { Module } from '@nestjs/common';
import { ModelModule } from '@vypham0209/nestjs-common';
import { DefaultBuilding } from 'modules/default-building/default-building.schema';
import { DefaultEnhanceModule } from 'modules/default-enhance/default-enhance.module';
import { DefaultResource } from 'modules/default-resource/default-resource.schema';
import { DefaultUnitType } from 'modules/default-unit-type/default-unit-type.schema';
import { DefaultUnit } from './default-unit.schema';
import { DefaultUnitService } from './default-unit.service';

@Module({
  imports: [
    ModelModule.registerWithoutRequest([
      DefaultUnit,
      DefaultBuilding,
      DefaultUnitType,
      DefaultResource,
    ]),
    DefaultEnhanceModule,
  ],
  providers: [DefaultUnitService],
  exports: [DefaultUnitService],
})
export class DefaultUnitModule {}
