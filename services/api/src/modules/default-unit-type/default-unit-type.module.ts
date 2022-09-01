/** @format */

import { Module } from '@nestjs/common';
import { ModelModule } from '@vypham0209/nestjs-common';
import { DefaultUnitType } from './default-unit-type.schema';
import { DefaultUnitTypeService } from './default-unit-type.service';

@Module({
  imports: [ModelModule.registerWithoutRequest([DefaultUnitType])],
  providers: [DefaultUnitTypeService],
  exports: [DefaultUnitTypeService],
})
export class DefaultUnitTypeModule {}
