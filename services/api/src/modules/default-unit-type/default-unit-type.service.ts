/** @format */

import { Injectable, Scope } from '@nestjs/common';
import { InjectMethodFactory, MethodFactory } from '@vypham0209/nestjs-common';
import { World } from 'modules/world/world.schema';
import { DefaultUnitType } from './default-unit-type.schema';
const UNIT_TYPE = [
  {
    name: 'Infantry',
    key: 'infantry',
    order: 5,
  },
  {
    name: 'Archers',
    key: 'archers',
    order: 3,
  },
  {
    name: 'Cavalry',
    key: 'cavalry',
    order: 4,
  },
  {
    name: 'Siege',
    key: 'siege',
    order: 1,
  },
  {
    name: 'Wall',
    key: 'wall',
    order: 2,
  },
];
@Injectable({ scope: Scope.DEFAULT })
export class DefaultUnitTypeService {
  @InjectMethodFactory(DefaultUnitType.collectionName)
  defaultUnitTypeMethodFactory: MethodFactory<DefaultUnitType>;
  async init(world: World) {
    const defaultUnitTypeMethod = this.defaultUnitTypeMethodFactory(
      world.tenant,
    );
    // Get all existing unit types
    const existingUnitTypes = await defaultUnitTypeMethod.model.find({
      key: { $in: UNIT_TYPE.map((unitType) => unitType.key) },
    });

    const unitTypePromises = UNIT_TYPE.map(async (unitType) => {
      const existingUnitType = existingUnitTypes.find(
        (existing) => existing.key === unitType.key,
      );

      if (existingUnitType) {
        // Update existing unit type
        return defaultUnitTypeMethod.findByIdAndUpdate(
          existingUnitType._id,
          unitType,
          { isThrow: true },
        );
      } else {
        // Create new unit type
        return defaultUnitTypeMethod.model.create(unitType);
      }
    });

    await Promise.all(unitTypePromises);
  }
}
