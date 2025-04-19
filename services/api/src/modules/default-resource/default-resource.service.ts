/** @format */

import { Injectable, Scope } from '@nestjs/common';
import { InjectMethodFactory, MethodFactory } from '@vypham0209/nestjs-common';
import { World } from 'modules/world/world.schema';
import { DefaultResource } from './default-resource.schema';
import * as path from 'path';
const resources = [
  {
    name: 'Gold',
    key: 'gold',
    path: path.join('resources', 'gold.webp'),
    order: 1,
  },
  {
    name: 'Iron',
    key: 'iron',
    path: path.join('resources', 'iron.webp'),
    order: 2,
  },
  {
    name: 'Wood',
    key: 'wood',
    path: path.join('resources', 'wood.webp'),
    order: 3,
  },
  {
    name: 'Food',
    key: 'food',
    path: path.join('resources', 'food.webp'),
    order: 4,
  },
];

@Injectable({ scope: Scope.DEFAULT })
export class DefaultResourceService {
  @InjectMethodFactory(DefaultResource.collectionName)
  defaultResourceMethodFactory: MethodFactory<DefaultResource>;

  resources: {
    [k: string]: DefaultResource[];
  } = {};
  async init(world: World) {
    const defaultResourceMethod = this.defaultResourceMethodFactory(
      world.tenant,
    );
    if (!this.resources[world.tenant]) {
      this.resources[world.tenant] = [];
    }
    const resourcePromises = resources.map(async (resource) => {
      let defaultResource = await defaultResourceMethod.findOne({
        key: resource.key,
      });
      const objectData = {
        ...resource,
        path: path.join(world.assets, resource.path),
      };
      if (defaultResource) {
        defaultResource = await defaultResourceMethod.findByIdAndUpdate(
          defaultResource._id,
          objectData,
          { isThrow: true },
        );
      } else {
        defaultResource = await defaultResourceMethod.model.create(objectData);
      }
      return defaultResource;
    });
    const defaultResources = await Promise.all(resourcePromises);
    this.resources[world.tenant].push(...defaultResources);
  }
}
