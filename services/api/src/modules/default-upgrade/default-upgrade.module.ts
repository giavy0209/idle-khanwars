/** @format */

import { Module } from '@nestjs/common';
import { ModelModule } from '@vypham0209/nestjs-common';
import { DefaultUpgrade } from './default-upgrade.schema';
import { DefaultUpgradeService } from './default-upgrade.service';

@Module({
  imports: [ModelModule.registerWithoutRequest([DefaultUpgrade])],
  providers: [DefaultUpgradeService],
  exports: [DefaultUpgradeService],
})
export class DefaultUpgradeModule {}
