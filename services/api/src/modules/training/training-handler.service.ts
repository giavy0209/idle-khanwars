/** @format */

import { Inject, Injectable, Scope } from '@nestjs/common';
import {
  CronService,
  InjectMethodFactory,
  MethodFactory,
} from '@vypham0209/nestjs-common';
import { Building } from 'modules/building/building.schema';
import { DefaultUnitService } from 'modules/default-unit/default-unit.service';
import { DefaultUpgradeService } from 'modules/default-upgrade/default-upgrade.service';
import { SocketGateway } from 'modules/socket/socket.gateway';
import { UNIT_POPULATE } from 'modules/unit/unit.constant';
import { Unit, UnitPullPopulate } from 'modules/unit/unit.schema';
import { World } from 'modules/world/world.schema';
import { Training, TrainingDocument } from './training.schema';

@Injectable({ scope: Scope.DEFAULT })
export class TrainingHandlerService {
  @Inject() socketGateway: SocketGateway;
  @Inject() cronService: CronService;
  @Inject() defaultUnitService: DefaultUnitService;
  @Inject() defaultUpgradeService: DefaultUpgradeService;
  @InjectMethodFactory(Training.collectionName)
  trainingMethodFactory: MethodFactory<Training>;
  @InjectMethodFactory(Unit.collectionName)
  unitMethodFactory: MethodFactory<Unit>;
  @InjectMethodFactory(Building.collectionName)
  buildingMethodFactory: MethodFactory<Building>;

  async init(world: World) {
    const trainingMethod = this.trainingMethodFactory(world.tenant);
    const trainings = await trainingMethod.find({
      query: {},
      count: false,
    });
    trainings.forEach((training) => {
      this.handle(world.tenant, training);
    });
  }

  async handle(tenant: string, training: TrainingDocument) {
    const next = new Date(training.nextAt).getTime() - Date.now();
    const trainingMethod = this.trainingMethodFactory(tenant);
    const unitMethod = this.unitMethodFactory(tenant);
    const buildingMethod = this.buildingMethodFactory(tenant);
    this.cronService.replaceTimeout(
      `${tenant}_training_${training._id.toString()}`,
      next < 0 ? 0 : next,
      async () => {
        training.left--;
        if (training.left <= 0) {
          training.left = 0;
          trainingMethod.findByIdAndDelete(training._id);
        } else {
          const unit = await unitMethod.findById(training.unit, {
            isThrow: true,
          });
          const unitDefault = this.defaultUnitService.find(
            tenant,
            unit.default,
          );

          if (!unitDefault) return;
          const building = await buildingMethod.findById(unit.building, {
            isThrow: true,
          });
          const upgrade = this.defaultUpgradeService.find(
            tenant,
            building.upgrade.current,
          );

          if (!upgrade) return;
          const timeReduce = upgrade.generate;
          const time = unitDefault.time - (unitDefault.time * timeReduce) / 100;
          training.nextAt = new Date(Date.now() + time * 1000);
          training.endAt = new Date(Date.now() + time * 1000 * training.left);
        }
        await training.save();
        this.socketGateway.emitTraining(training.castle, training);

        unitMethod.createQueue(async () => {
          const unit = await unitMethod.findById<UnitPullPopulate>(
            training.unit,
            { isThrow: true, populate: UNIT_POPULATE },
          );
          unit.total++;
          await unit.save();
          this.socketGateway.emitUnit(training.castle, unit);
        });
        if (training.left > 0) {
          this.handle(tenant, training);
        } else {
          this.cronService.deleteCron(
            `${tenant}_training_${training._id.toString()}`,
            'timeout',
          );
        }
      },
    );
  }
}
