/** @format */

import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectMethod, Method } from '@vypham0209/nestjs-common';
import { SOCKET } from 'enum/socket.enum';
import { Building } from 'modules/building/building.schema';
import { Castle } from 'modules/castle/castle.schema';
import { DefaultBuildingService } from 'modules/default-building/default-building.service';
import { DefaultResourceService } from 'modules/default-resource/default-resource.service';
import { SocketGateway } from 'modules/socket/socket.gateway';
import { ResourceCost } from 'shared/resource/resource-cost.schema';
import { RESOURCE_POPULATE } from './resource.constant';
import { Resource } from './resource.schema';

@Injectable()
export class ResourceService {
  @Inject() defaultResourceService: DefaultResourceService;
  @Inject() socketGateway: SocketGateway;
  @Inject() defaultBuildingService: DefaultBuildingService;
  @InjectMethod(Resource.collectionName) resourceMethod: Method<Resource>;
  @InjectMethod(Building.collectionName) buildingMethod: Method<Building>;

  async getByCastle(castle: DataId) {
    const data = await this.resourceMethod.find({
      query: { castle },
      count: false,
      lean: true,
      populate: RESOURCE_POPULATE,
    });
    return data;
  }

  async init(castle: Castle, tenant: string) {
    for (const resource of this.defaultResourceService.resources[tenant]) {
      const defaultBuilding = this.defaultBuildingService.buildings[
        tenant
      ].find((b) => b.resource.toString() === resource._id.toString());
      const building = await this.buildingMethod.findOne({
        castle: castle._id,
        default: defaultBuilding?._id,
      });
      await this.resourceMethod.model.create({
        castle: castle._id,
        building: building?._id,
        default: resource._id,
      });
    }
  }

  async isEnoughResource(
    resourcesCost: ResourceCost[],
    castle: DataId,
    multiple = 1,
  ) {
    const totalCost = resourcesCost.map((cost) => {
      return {
        type: cost.type,
        value: cost.value * multiple,
      };
    });

    const currentResource = await this.resourceMethod.find({
      query: {
        castle,
        $or: totalCost.map((o) => {
          return {
            default: o.type,
            value: { $gte: o.value },
          };
        }),
      },
      count: false,
    });
    if (currentResource.length < totalCost.length) {
      throw new BadRequestException("You don't have enough resource");
    }

    return totalCost;
  }

  async spendResources(
    castle: DataId,
    resources: ResourceCost[],
    constant = 1,
  ) {
    await Promise.all(
      resources.map(
        async ({ type, value }) =>
          await this.resourceMethod.createQueue(async () => {
            const resource = await this.resourceMethod.findOne(
              { default: type, castle: castle },
              { isThrow: true, populate: RESOURCE_POPULATE },
            );
            resource.value += value * constant;
            await resource.save();
            this.socketGateway.server
              .to(castle.toString())
              .emit(SOCKET.EVENT.RESOURCES, resource);
          }),
      ),
    );
  }
}
