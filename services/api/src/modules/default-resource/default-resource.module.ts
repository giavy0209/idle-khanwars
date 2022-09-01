/** @format */

import { Module } from '@nestjs/common';
import { ModelModule } from '@vypham0209/nestjs-common';
import { DefaultResource } from './default-resource.schema';
import { DefaultResourceService } from './default-resource.service';

@Module({
  imports: [ModelModule.registerWithoutRequest([DefaultResource])],
  providers: [DefaultResourceService],
  exports: [DefaultResourceService],
})
export class DefaultResourceModule {}
