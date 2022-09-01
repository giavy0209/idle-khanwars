/** @format */

import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectMethod, Method, TOKEN } from '@vypham0209/nestjs-common';
import { COLLECTION } from 'enum/collection.enum';
import { CastleService } from 'modules/castle/castle.service';
import { ResourceService } from 'modules/resource/resource.service';
import { SocketGateway } from 'modules/socket/socket.gateway';
import { UNIT_SIMPLE_POPULATE } from 'modules/unit/unit.constant';
import { Unit, UnitSimplePullPopulate } from 'modules/unit/unit.schema';
import { Types } from 'mongoose';
import { PostTrainingDto } from './dto/post-training.dto';
import { TrainingHandlerService } from './training-handler.service';
import { Training } from './training.schema';

@Injectable()
export class TrainingService {
  @Inject(TOKEN.TENANT) tenant: string;
  @Inject() resourceService: ResourceService;
  @Inject() socketGateway: SocketGateway;
  @Inject() castleService: CastleService;
  @Inject() trainingHandlerService: TrainingHandlerService;
  @InjectMethod(Training.collectionName) trainingMethod: Method<Training>;
  @InjectMethod(Unit.collectionName) unitMethod: Method<Unit>;
  async post({ total, unit }: PostTrainingDto) {
    const findUnit = await this.unitMethod.findById<UnitSimplePullPopulate>(
      new Types.ObjectId(unit),
      { isThrow: true, populate: UNIT_SIMPLE_POPULATE },
    );

    if (findUnit.building.upgrade.current.level === 0) {
      throw new BadRequestException('Please upgrade the building first');
    }

    const isHaveUnitTraining = await this.trainingMethod.model.aggregate([
      {
        $match: {
          deletedAt: { $exists: false },
        },
      },
      ...this.trainingMethod.generateLookup([
        {
          from: COLLECTION.units,
          localField: 'unit',
        },
      ]),
      {
        $match: {
          'unit.building': new Types.ObjectId(findUnit.building._id),
        },
      },
    ]);

    if (isHaveUnitTraining[0]) {
      throw new BadRequestException('There is an unit training');
    }

    const [resourcesCost, populationLeft] = await Promise.all([
      this.resourceService.isEnoughResource(
        findUnit.default.resources,
        findUnit.castle,
        total,
      ),
      this.castleService.populationLeft(findUnit.castle),
    ]);

    if (findUnit.default.population * total > populationLeft) {
      throw new BadRequestException('Not enough population');
    }
    this.resourceService.spendResources(findUnit.castle, resourcesCost, -1);

    const reducePercent = findUnit.building.upgrade.current.generate;

    const defaultTimePerOne = findUnit.default.time * 1000;

    const timePerOne = (defaultTimePerOne * (100 - reducePercent)) / 100;
    const now = Date.now();
    const nextAt = now + timePerOne;
    const training = await this.trainingMethod.model.create({
      castle: findUnit.castle,
      unit,
      total,
      left: total,
      nextAt: new Date(nextAt),
      endAt: new Date(now + timePerOne * total),
    });
    this.socketGateway.emitTraining(training.castle, training);
    this.trainingHandlerService.handle(this.tenant, training);
    return training;
  }
}
