/** @format */

import { Injectable, Scope } from '@nestjs/common';
import { InjectMethodFactory, MethodFactory } from '@vypham0209/nestjs-common';
import { DefaultBuilding } from 'modules/default-building/default-building.schema';
import { DefaultResource } from 'modules/default-resource/default-resource.schema';
import { World } from 'modules/world/world.schema';
import { DefaultUpgrade } from './default-upgrade.schema';
interface IUpgrade {
  level: number;
  gold: number;
  iron: number;
  wood: number;
  food: number;
  generate: number;
  time: number;
}
@Injectable({ scope: Scope.DEFAULT })
export class DefaultUpgradeService {
  @InjectMethodFactory(DefaultUpgrade.collectionName)
  defaultUpgradeMethodFactory: MethodFactory<DefaultUpgrade>;

  upgrades: {
    [k: string]: DefaultUpgrade[];
  } = {};

  find(tenant: string, id: DataId) {
    return this.upgrades[tenant].find(
      (o) => o._id.toString() === id.toString(),
    );
  }

  async init(
    world: World,
    upgrades: IUpgrade[],
    building: DefaultBuilding,
    isResource: boolean,
    { gold, iron, wood, food }: { [k: string]: DefaultResource | null },
  ) {
    if (!this.upgrades[world.tenant]) {
      this.upgrades[world.tenant] = [];
    }
    const defaultUpgradeMethod = this.defaultUpgradeMethodFactory(world.tenant);
    const upgradePromises = upgrades.map(async (upgrade) => {
      //Due to I get the value from the x5 world, so I need to divide by 5
      const generate = isResource
        ? Math.round((upgrade.generate / 5) * world.speed)
        : upgrade.generate;
      let findUpgrade = await defaultUpgradeMethod.findOne({
        building: building._id,
        level: upgrade.level,
      });
      const objectData = {
        building: building._id,
        level: upgrade.level,
        generate: generate,
        time: upgrade.time / world.speed,
        resources: [
          { type: gold?._id, value: upgrade.gold },
          { type: iron?._id, value: upgrade.iron },
          { type: wood?._id, value: upgrade.wood },
          { type: food?._id, value: upgrade.food },
        ],
      };
      if (findUpgrade) {
        findUpgrade = await defaultUpgradeMethod.findByIdAndUpdate(
          findUpgrade._id,
          objectData,
          { isThrow: true },
        );
      } else {
        findUpgrade = await defaultUpgradeMethod.model.create(objectData);
      }
      return findUpgrade;
    });

    const defaultUpgrades = await Promise.all(upgradePromises);
    this.upgrades[world.tenant].push(...defaultUpgrades);
  }
}
