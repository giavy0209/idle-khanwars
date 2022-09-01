/** @format */

import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectMethod, Method, TOKEN } from '@vypham0209/nestjs-common';
import { BUILDING_UPGRADE_POPULATE } from 'modules/building/building.constant';
import {
  Building,
  BuildingUpgradePullPopulate,
} from 'modules/building/building.schema';
import { ResourceService } from 'modules/resource/resource.service';
import { SocketGateway } from 'modules/socket/socket.gateway';
import { UpgradeHandlerService } from './update-handler.service';
import { Upgrade } from './upgrade.schema';
import { Types } from 'mongoose';

@Injectable()
export class UpgradeService {
  @Inject(TOKEN.TENANT) tenant: string;
  @Inject() socketGateway: SocketGateway;
  @Inject() resourceService: ResourceService;
  @Inject() upgradeHandlerService: UpgradeHandlerService;
  @InjectMethod(Upgrade.collectionName) upgradeMethod: Method<Upgrade>;
  @InjectMethod(Building.collectionName) buildingMethod: Method<Building>;
  async post(building: DataId) {
    const findBuilding =
      await this.buildingMethod.findById<BuildingUpgradePullPopulate>(
        new Types.ObjectId(building),
        { isThrow: true, populate: BUILDING_UPGRADE_POPULATE },
      );
    await this.upgradeMethod.exists(
      { castle: findBuilding.castle },
      { throwCase: 'IF_EXISTS' },
    );
    if (!findBuilding.upgrade.next) {
      throw new BadRequestException('Building max level');
    }
    const resources = await this.resourceService.isEnoughResource(
      findBuilding.upgrade.next.resources,
      findBuilding.castle,
    );
    await this.resourceService.spendResources(
      findBuilding.castle,
      resources,
      -1,
    );
    const time = findBuilding.upgrade.next.time * 1000;
    const endAt = new Date(Date.now() + time);
    const upgrade = await this.upgradeMethod.model.create({
      building,
      castle: findBuilding.castle,
      endAt,
    });
    this.socketGateway.emitUpgrade(upgrade.castle, upgrade);

    this.upgradeHandlerService.handler(this.tenant, upgrade);
  }

  async delete(id: DataId) {
    const upgrade = await this.upgradeMethod.findById(new Types.ObjectId(id), {
      isThrow: true,
    });
    upgrade.deletedAt = new Date();
    await upgrade.save();
    this.socketGateway.emitUpgrade(upgrade.castle, upgrade);
    this.upgradeHandlerService.clearSchedule(this.tenant, upgrade._id);
    return upgrade;
  }
}
