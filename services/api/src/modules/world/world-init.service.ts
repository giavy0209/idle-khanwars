import { Inject, Injectable, Scope } from '@nestjs/common';
import { DefaultBuildingService } from 'modules/default-building/default-building.service';
import { DefaultResourceService } from 'modules/default-resource/default-resource.service';
import { DefaultUnitTypeService } from 'modules/default-unit-type/default-unit-type.service';
import { DefaultUnitService } from 'modules/default-unit/default-unit.service';
import { TrainingHandlerService } from 'modules/training/training-handler.service';
import { UpgradeHandlerService } from 'modules/upgrade/update-handler.service';
import { World } from './world.schema';
@Injectable({ scope: Scope.DEFAULT })
export class WorldInitService {
  @Inject() trainingHandlerService: TrainingHandlerService;
  @Inject() upgradeHandlerService: UpgradeHandlerService;
  @Inject() defaultResourceService: DefaultResourceService;
  @Inject() defaultBuildingService: DefaultBuildingService;
  @Inject() defaultUnitTypeService: DefaultUnitTypeService;
  @Inject() defaultUnitService: DefaultUnitService;
  async init(world: World) {
    console.time(`init resource ${world.name}`);
    await this.defaultResourceService.init(world);
    console.timeEnd(`init resource ${world.name}`);

    console.time(`init building ${world.name}`);
    await this.defaultBuildingService.init(world);
    console.timeEnd(`init building ${world.name}`);

    console.time(`init unit type ${world.name}`);
    await this.defaultUnitTypeService.init(world);
    console.timeEnd(`init unit type ${world.name}`);

    console.time(`init unit ${world.name}`);
    await this.defaultUnitService.init(world);
    console.timeEnd(`init unit ${world.name}`);

    console.time(`init training ${world.name}`);
    await this.trainingHandlerService.init(world);
    console.timeEnd(`init training ${world.name}`);

    console.time(`init upgrade ${world.name}`);
    await this.upgradeHandlerService.init(world);
    console.timeEnd(`init upgrade ${world.name}`);
  }
}
