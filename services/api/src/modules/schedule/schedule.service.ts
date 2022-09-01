/** @format */

import { Inject, Injectable, Scope } from '@nestjs/common';
import {
  CronService,
  InjectMethodFactory,
  MethodFactory,
} from '@vypham0209/nestjs-common';
import { SOCKET } from 'enum/socket.enum';
import { Castle } from 'modules/castle/castle.schema';
import { RESOURCE_POPULATE } from 'modules/resource/resource.constant';
import {
  Resource,
  ResourcePullPopulate,
} from 'modules/resource/resource.schema';
import { SocketGateway } from 'modules/socket/socket.gateway';
import { World } from 'modules/world/world.schema';

@Injectable({ scope: Scope.DEFAULT })
export class ScheduleService {
  @Inject() cronService: CronService;
  @Inject() socketGateway: SocketGateway;
  @InjectMethodFactory(Resource.collectionName)
  resourceMethodFactory: MethodFactory<Resource>;
  @InjectMethodFactory(Castle.collectionName)
  castleMethodFactory: MethodFactory<Castle>;
  register(world: World) {
    this.registerResource(world);
  }

  async registerResource(world: World) {
    const castleMethod = this.castleMethodFactory(world.tenant);
    const resourceMethod = this.resourceMethodFactory(world.tenant);
    this.cronService.registerInterval(
      `${world.tenant}_resource`,
      5000,
      async () => {
        const castles = await castleMethod.find({
          count: false,
        });
        for (const castle of castles) {
          const resources = await resourceMethod.find<ResourcePullPopulate>({
            query: { castle },
            count: false,
            populate: RESOURCE_POPULATE,
          });

          for (const resource of resources) {
            const generatePerHours = resource.building.upgrade.current.generate;
            const lastUpdated = resource.updatedAt;
            const now = Date.now();
            const msFromLastUpdated = now - new Date(lastUpdated).getTime();
            const msPerHours = 60 * 60 * 1000;
            const percentMs = msFromLastUpdated / msPerHours;

            const generated = generatePerHours * percentMs;
            resourceMethod.createQueue(async () => {
              const findResource = await resourceMethod.model
                .findById(resource._id)
                .populate(RESOURCE_POPULATE);
              if (!findResource) return;
              findResource.value += generated;
              await findResource.save();

              this.socketGateway.server
                .to(castle._id.toString())
                .emit(SOCKET.EVENT.RESOURCES, findResource);
            });
          }
        }
      },
    );
  }
}
