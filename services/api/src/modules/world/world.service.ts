/** @format */

import { Inject, Injectable } from '@nestjs/common';
import { InjectMethodFactory, MethodFactory } from '@vypham0209/nestjs-common';
import { Types } from 'mongoose';
import { PostWorldDto } from './dto/post-world.dto';
import { WorldInitService } from './world-init.service';
import { World } from './world.schema';

@Injectable()
export class WorldService {
  @InjectMethodFactory(World.collectionName)
  readonly worldMethodFactory: MethodFactory<World>;
  @Inject() worldInitService: WorldInitService;
  async get(queryParams?: QueryParams) {
    const worldMethod = this.worldMethodFactory();
    const data = await worldMethod.find({
      query: {},
      count: false,
      ...queryParams,
    });
    return data;
  }

  async post({ tenant, name, speed, _id }: PostWorldDto & { _id?: DataId }) {
    const worldMethod = this.worldMethodFactory();
    await worldMethod.exists({ tenant }, { throwCase: 'IF_EXISTS' });
    await worldMethod.exists({ name }, { throwCase: 'IF_EXISTS' });
    const data = await worldMethod.create({
      _id: _id || new Types.ObjectId(),
      name,
      tenant,
      speed,
    });
    await this.worldInitService.init(data);
    return data;
  }
}
