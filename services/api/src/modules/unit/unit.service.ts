/** @format */

import { Inject, Injectable } from '@nestjs/common';
import { InjectMethod, Method } from '@vypham0209/nestjs-common';
import { DEFAULT_ENHANCE } from 'enum/default-enhance.enum';
import { Building } from 'modules/building/building.schema';
import { Castle } from 'modules/castle/castle.schema';
import { DefaultEnhanceService } from 'modules/default-enhance/default-enhance.service';
import { DefaultUnitService } from 'modules/default-unit/default-unit.service';
import { Unit } from './unit.schema';

@Injectable()
export class UnitService {
  @Inject() defaultUnitService: DefaultUnitService;
  @Inject() defaultEnhanceService: DefaultEnhanceService;
  @InjectMethod(Unit.collectionName) unitMethod: Method<Unit>;
  @InjectMethod(Building.collectionName) buildingMethod: Method<Building>;
  async init(castle: Castle, tenant: string) {
    for (const defaultUnit of this.defaultUnitService.units[tenant]) {
      const building = await this.buildingMethod.findOne(
        { castle: castle._id, default: defaultUnit.building },
        { isThrow: true },
      );
      const enhances = this.defaultEnhanceService.enhances[tenant].filter(
        (e) => {
          return (
            e.unit.toString() === defaultUnit._id.toString() &&
            (e.level === 0 || e.level === 1)
          );
        },
      );
      await this.unitMethod.model.create({
        castle: castle._id,
        building: building._id,
        default: defaultUnit._id,
        enhance: {
          current: {
            attack: enhances.find(
              (enhance) =>
                enhance.level === 0 &&
                enhance.type === DEFAULT_ENHANCE.TYPE.ATTACK,
            ),
            hp: enhances.find(
              (enhance) =>
                enhance.level === 0 && enhance.type === DEFAULT_ENHANCE.TYPE.HP,
            ),
            cargo: enhances.find(
              (enhance) =>
                enhance.level === 0 &&
                enhance.type === DEFAULT_ENHANCE.TYPE.CARGO,
            ),
          },
          next: {
            attack: enhances.find(
              (enhance) =>
                enhance.level === 1 &&
                enhance.type === DEFAULT_ENHANCE.TYPE.ATTACK,
            ),
            hp: enhances.find(
              (enhance) =>
                enhance.level === 1 && enhance.type === DEFAULT_ENHANCE.TYPE.HP,
            ),
            cargo: enhances.find(
              (enhance) =>
                enhance.level === 1 &&
                enhance.type === DEFAULT_ENHANCE.TYPE.CARGO,
            ),
          },
        },
      });
    }
  }
}
