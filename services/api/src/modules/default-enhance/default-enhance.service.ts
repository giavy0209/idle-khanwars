/** @format */

import { Injectable, Scope } from '@nestjs/common';
import { InjectMethodFactory, MethodFactory } from '@vypham0209/nestjs-common';
import { DEFAULT_ENHANCE } from 'enum/default-enhance.enum';
import { DefaultUnit } from 'modules/default-unit/default-unit.schema';
import { World } from 'modules/world/world.schema';
import { DefaultEnhance } from './default-enhance.schema';

@Injectable({ scope: Scope.DEFAULT })
export class DefaultEnhanceService {
  @InjectMethodFactory(DefaultEnhance.collectionName)
  defaultEnhanceMethodFactory: MethodFactory<DefaultEnhance>;
  enhances: {
    [k: string]: DefaultEnhance[];
  } = {};
  async init(world: World, defaultUnit: DefaultUnit) {
    if (!this.enhances[world.tenant]) {
      this.enhances[world.tenant] = [];
    }
    const defaultEnhanceMethod = this.defaultEnhanceMethodFactory(world.tenant);
    const enhancePromises: (() => Promise<DefaultEnhance>)[] = [];

    for (let index = 0; index <= 10; index++) {
      for (const type of DEFAULT_ENHANCE.TYPES) {
        enhancePromises.push(async () => {
          let findEnhance = await defaultEnhanceMethod.findOne({
            unit: defaultUnit._id,
            level: index,
            type,
          });
          const objectData = {
            unit: defaultUnit._id,
            level: index,
            type,
            value: index * 10,
            time: defaultUnit.time * 10 * index,
            resources: defaultUnit.resources.map((o) => ({
              type: o.type._id,
              value: o.value * 10 * index,
            })),
          };
          if (findEnhance) {
            findEnhance = await defaultEnhanceMethod.findByIdAndUpdate(
              findEnhance._id,
              objectData,
              { isThrow: true },
            );
          } else {
            findEnhance = await defaultEnhanceMethod.model.create(objectData);
          }
          return findEnhance;
        });
      }
    }

    const enhanceResults = await Promise.all(enhancePromises.map((fn) => fn()));
    this.enhances[world.tenant].push(...enhanceResults);
  }
}
