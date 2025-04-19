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
    for (const [index, unitType] of UNIT_TYPE.entries()) {
      console.log(`start init ${index + 1}/${UNIT_TYPE.length} unit type`);
      const isExist = await defaultUnitTypeMethod.findOne({
        key: unitType.key,
      });
      if (isExist) {
        await defaultUnitTypeMethod.findByIdAndUpdate(isExist._id, unitType);
      } else {
        await defaultUnitTypeMethod.model.create(unitType);
      }
      console.log(`finish init ${index + 1}/${UNIT_TYPE.length} unit type`);
    }
  }
}
