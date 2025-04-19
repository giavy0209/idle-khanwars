/** @format */

import { Inject, Injectable, Scope } from '@nestjs/common';
import { InjectMethodFactory, MethodFactory } from '@vypham0209/nestjs-common';
import { DefaultBuilding } from 'modules/default-building/default-building.schema';
import { DefaultEnhanceService } from 'modules/default-enhance/default-enhance.service';
import { DefaultResource } from 'modules/default-resource/default-resource.schema';
import { DefaultUnitType } from 'modules/default-unit-type/default-unit-type.schema';
import { World } from 'modules/world/world.schema';
import { DEFAULT_UNIT } from './default-unit.constant';
import { DefaultUnit } from './default-unit.schema';
import * as path from 'path';

@Injectable({ scope: Scope.DEFAULT })
export class DefaultUnitService {
  @InjectMethodFactory(DefaultUnit.collectionName)
  defaultUnitMethodFactory: MethodFactory<DefaultUnit>;
  @InjectMethodFactory(DefaultBuilding.collectionName)
  defaultBuildingMethodFactory: MethodFactory<DefaultBuilding>;
  @InjectMethodFactory(DefaultUnitType.collectionName)
  defaultUnitTypeMethodFactory: MethodFactory<DefaultUnitType>;
  @InjectMethodFactory(DefaultResource.collectionName)
  defaultResourceMethodFactory: MethodFactory<DefaultResource>;
  @Inject() defaultEnhanceService: DefaultEnhanceService;

  units: {
    [k: string]: DefaultUnit[];
  } = {};

  find(tenant: string, id: DataId) {
    return this.units[tenant].find((o) => o._id.toString() === id.toString());
  }

  async init(world: World) {
    if (!this.units[world.tenant]) {
      this.units[world.tenant] = [];
    }
    const defaultUnitMethod = this.defaultUnitMethodFactory(world.tenant);
    const defaultBuildingMethod = this.defaultBuildingMethodFactory(
      world.tenant,
    );
    const defaultUnitTypeMethod = this.defaultUnitTypeMethodFactory(
      world.tenant,
    );
    const defaultResourceMethod = this.defaultResourceMethodFactory(
      world.tenant,
    );
    const gold = await defaultResourceMethod.findOne({ key: 'gold' });
    const iron = await defaultResourceMethod.findOne({ key: 'iron' });
    const wood = await defaultResourceMethod.findOne({ key: 'wood' });
    const food = await defaultResourceMethod.findOne({ key: 'food' });

    const infantry = await defaultUnitTypeMethod.findOne({ key: 'infantry' });
    const archers = await defaultUnitTypeMethod.findOne({ key: 'archers' });
    const cavalry = await defaultUnitTypeMethod.findOne({ key: 'cavalry' });
    const siege = await defaultUnitTypeMethod.findOne({ key: 'siege' });
    const wall = await defaultUnitTypeMethod.findOne({ key: 'wall' });
    for (const [index, unit] of DEFAULT_UNIT.entries()) {
      console.log(`start init ${index + 1}/${DEFAULT_UNIT.length} unit`);
      const building = await defaultBuildingMethod.findOne({
        name: unit.building,
      });
      let defaultUnit = await defaultUnitMethod.findOne({ key: unit.key });
      const unitType = await defaultUnitTypeMethod.findOne({ key: unit.type });
      const objectData = {
        name: unit.name,
        key: unit.key,
        order: unitType?.order,
        description: unit.description,
        type: unitType?._id,
        building: building?._id,
        time: unit.time / world.speed,
        speed: unit.speed,
        cargo: unit.cargo,
        life: unit.life,
        range: unit.range,
        population: unit.population,
        path: path.join(world.assets, 'units', unit.path),
        resources: [
          { type: gold?._id, value: unit.resource.gold },
          { type: iron?._id, value: unit.resource.iron },
          { type: wood?._id, value: unit.resource.wood },
          { type: food?._id, value: unit.resource.food },
        ],
        strength: [
          { type: infantry?._id, value: unit.strength.infantry },
          { type: archers?._id, value: unit.strength.archers },
          { type: cavalry?._id, value: unit.strength.cavalry },
          { type: siege?._id, value: unit.strength.siege },
          { type: wall?._id, value: unit.strength.wall },
        ],
      };

      if (defaultUnit) {
        defaultUnit = await defaultUnitMethod.findByIdAndUpdate(
          defaultUnit._id,
          objectData,
          { isThrow: true },
        );
      } else {
        defaultUnit = await defaultUnitMethod.model.create(objectData);
      }
      this.units[world.tenant].push(defaultUnit);
      await this.defaultEnhanceService.init(world, defaultUnit);
      console.log(`finish init ${index + 1}/${DEFAULT_UNIT.length} unit`);
    }
  }
}
