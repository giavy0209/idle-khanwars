/** @format */

import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectMethod, Method, TOKEN } from '@vypham0209/nestjs-common';
import { Castle } from 'modules/castle/castle.schema';
import { DEFAULT_BUILDING } from 'modules/default-building/default-building.enum';
import { DefaultBuildingService } from 'modules/default-building/default-building.service';
import { DefaultUpgradeService } from 'modules/default-upgrade/default-upgrade.service';
import { BUILDING_LEVEL_POPULATE } from './building.constant';
import { Building, BuildingLevelPullPopulate } from './building.schema';

@Injectable()
export class BuildingService {
  @InjectMethod(Building.collectionName) buildingMethod: Method<Building>;
  @Inject() defaultBuildingService: DefaultBuildingService;
  @Inject() defaultUpgradeService: DefaultUpgradeService;
  @Inject(TOKEN.TENANT) tenant: string;
  async init(castle: Castle, tenant: string) {
    for (const defaultBuilding of this.defaultBuildingService.buildings[
      tenant
    ]) {
      const upgrade0 = this.defaultUpgradeService.upgrades[tenant].find(
        (u) =>
          u.building.toString() === defaultBuilding._id.toString() &&
          u.level === 0,
      );
      const upgrade1 = this.defaultUpgradeService.upgrades[tenant].find(
        (u) =>
          u.building.toString() === defaultBuilding._id.toString() &&
          u.level === 1,
      );
      await this.buildingMethod.model.create({
        castle: castle._id,
        default: defaultBuilding._id,
        upgrade: {
          current: upgrade0?._id,
          next: upgrade1?._id,
        },
      });
    }
  }

  async findBuildingByKey(key: DEFAULT_BUILDING.KEY, castle: DataId) {
    const defaultBuilding = this.defaultBuildingService.buildings[
      this.tenant
    ].find((o) => o.key === key);
    if (!defaultBuilding) {
      throw new InternalServerErrorException('Building not found in server');
    }

    const building =
      await this.buildingMethod.findOne<BuildingLevelPullPopulate>(
        {
          castle,
          default: defaultBuilding._id,
        },
        {
          populate: BUILDING_LEVEL_POPULATE,
        },
      );
    if (!building) {
      throw new InternalServerErrorException(`${key} not found in the server`);
    }
    return building;
  }
}
