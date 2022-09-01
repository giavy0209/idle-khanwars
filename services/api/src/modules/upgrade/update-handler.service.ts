/** @format */

import { Inject } from '@nestjs/common';
import {
  CronService,
  InjectMethodFactory,
  MethodFactory,
} from '@vypham0209/nestjs-common';
import { BUILDING_POPULATE } from 'modules/building/building.constant';
import {
  Building,
  BuildingPullPopulate,
} from 'modules/building/building.schema';
import { DefaultUpgradeService } from 'modules/default-upgrade/default-upgrade.service';
import { SocketGateway } from 'modules/socket/socket.gateway';
import { World } from 'modules/world/world.schema';
import { Types } from 'mongoose';
import { Upgrade, UpgradeDocument } from './upgrade.schema';

export class UpgradeHandlerService {
  @Inject() cronService: CronService;
  @Inject() socketGateway: SocketGateway;
  @Inject() defaultUpgradeService: DefaultUpgradeService;
  @InjectMethodFactory(Upgrade.collectionName)
  upgradeMethodFactory: MethodFactory<Upgrade>;
  @InjectMethodFactory(Building.collectionName)
  buildingMethodFactory: MethodFactory<Building>;
  async init(world: World) {
    const upgradeMethod = this.upgradeMethodFactory(world.tenant);
    const upgrades = await upgradeMethod.find({
      count: false,
    });
    upgrades.forEach((upgrade) => {
      this.handler(world.tenant, upgrade);
    });
  }
  async handler(tenant: string, upgrade: UpgradeDocument) {
    const buildingMethod = this.buildingMethodFactory(tenant);
    const next = new Date(upgrade.endAt).getTime() - Date.now();
    this.cronService.registerTimeout(
      `${tenant}_upgrade_${upgrade._id}`,
      next < 0 ? 0 : next,
      async () => {
        console.log('schedule');

        upgrade.deletedAt = new Date();
        const building = await buildingMethod.findById(upgrade.building, {
          isThrow: true,
        });
        const findNextUpgrade = this.defaultUpgradeService.upgrades[
          tenant
        ].find((o) => o._id.toString() === building.upgrade.next.toString());

        if (!findNextUpgrade) return;
        const findOneLvUpgrade = this.defaultUpgradeService.upgrades[
          tenant
        ].find(
          (o) =>
            o.building.toString() === findNextUpgrade.building.toString() &&
            o.level === findNextUpgrade.level + 1,
        );
        building.upgrade.current = building.upgrade.next;
        building.upgrade.next = findOneLvUpgrade?._id as Types.ObjectId;
        await building.save();
        const findBuilding =
          await buildingMethod.findById<BuildingPullPopulate>(building._id, {
            populate: BUILDING_POPULATE,
            isThrow: true,
          });

        this.socketGateway.emitBuilding(upgrade.castle, findBuilding);
        await upgrade.save();
        this.socketGateway.emitUpgrade(upgrade.castle, upgrade);
      },
    );
  }

  clearSchedule(tenant: string, id: DataId) {
    this.cronService.deleteCron(`${tenant}_upgrade_${id}`, 'timeout');
  }
}
