/** @format */

import { Module } from '@nestjs/common';
import { ModelModule } from '@vypham0209/nestjs-common';
import { DefaultEnhance } from './default-enhance.schema';
import { DefaultEnhanceService } from './default-enhance.service';

@Module({
  imports: [ModelModule.registerWithoutRequest([DefaultEnhance])],
  providers: [DefaultEnhanceService],
  exports: [DefaultEnhanceService],
})
export class DefaultEnhanceModule {}
