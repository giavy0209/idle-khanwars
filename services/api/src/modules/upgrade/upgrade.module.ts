/** @format */

import { Module } from '@nestjs/common';
import { ModelModule } from '@vypham0209/nestjs-common';
import { Building } from 'modules/building/building.schema';
import { DefaultUpgradeModule } from 'modules/default-upgrade/default-upgrade.module';
import { ResourceModule } from 'modules/resource/resource.module';
import { SocketModule } from 'modules/socket/socket.module';
import { UpgradeHandlerService } from './update-handler.service';
import { UpgradeController } from './upgrade.controller';
import { Upgrade } from './upgrade.schema';
import { UpgradeService } from './upgrade.service';

@Module({
  imports: [
    ModelModule.register([Upgrade, Building]),
    ModelModule.registerWithoutRequest([Upgrade, Building]),
    ResourceModule,
    SocketModule,
    DefaultUpgradeModule,
  ],
  controllers: [UpgradeController],
  providers: [UpgradeService, UpgradeHandlerService],
  exports: [UpgradeService, UpgradeHandlerService],
})
export class UpgradeModule {}
