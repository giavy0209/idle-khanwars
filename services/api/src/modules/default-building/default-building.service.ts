import { Inject, Injectable, Scope } from '@nestjs/common';
import { InjectMethodFactory, MethodFactory } from '@vypham0209/nestjs-common';
import { DefaultResource } from 'modules/default-resource/default-resource.schema';
import { DefaultUpgradeService } from 'modules/default-upgrade/default-upgrade.service';
import { World } from 'modules/world/world.schema';
import { BUILDING } from './default-building.constant';
import { DefaultBuilding } from './default-building.schema';
import * as path from 'path';

@Injectable({ scope: Scope.DEFAULT })
export class DefaultBuildingService {
  @InjectMethodFactory(DefaultBuilding.collectionName)
  defaultBuildingMethodFactory: MethodFactory<DefaultBuilding>;
  @InjectMethodFactory(DefaultResource.collectionName)
  defaultResourceMethodFactory: MethodFactory<DefaultResource>;
  @Inject() defaultUpgradeService: DefaultUpgradeService;

  buildings: {
    [k: string]: DefaultBuilding[];
  } = {};

  async init(world: World) {
    if (!this.buildings[world.tenant]) {
      this.buildings[world.tenant] = [];
    }
    const defaultBuildingMethod = this.defaultBuildingMethodFactory(
      world.tenant,
    );
    const defaultResourceMethod = this.defaultResourceMethodFactory(
      world.tenant,
    );
    const gold = await defaultResourceMethod.findOne({ key: 'gold' });
    const iron = await defaultResourceMethod.findOne({ key: 'iron' });
    const wood = await defaultResourceMethod.findOne({ key: 'wood' });
    const food = await defaultResourceMethod.findOne({ key: 'food' });
    const buildingPromises = BUILDING.map(async (building) => {
      let findBuilding = await defaultBuildingMethod.findOne({
        name: building.name,
      });
      const resource = await defaultResourceMethod.findOne({
        key: building.resource,
      });
      const objectData = {
        name: building.name,
        key: building.key,
        description: building.description,
        type: building.type,
        path: path.join('buildings', building.path),
        resource: resource?._id,
        generate: building.generate,
        unit: building.unit,
      };
      if (findBuilding) {
        const plainObj = findBuilding.toObject();
        findBuilding.set({
          ...plainObj,
          ...objectData,
        });
        await findBuilding.save();
      } else {
        findBuilding = await defaultBuildingMethod.model.create(objectData);
      }

      this.defaultUpgradeService.init(
        world,
        building.upgrade,
        findBuilding,
        !!resource,
        { gold, iron, wood, food },
      );
      return findBuilding;
    });

    const defaultBuildings = await Promise.all(buildingPromises);
    this.buildings[world.tenant].push(...defaultBuildings);
  }
}
