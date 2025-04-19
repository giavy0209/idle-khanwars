import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { setNotToastSuccess } from 'app/http-interceptors/context';
import { DEFAULT_BUILDING } from 'app/shared/interfaces/default-building.interface';
import { BuildingService } from 'app/shared/services/building/building.service';
import { BehaviorSubject, combineLatest, switchMap, tap } from 'rxjs';
import { Response } from 'types';
import { ResourceService } from '../resource/resource.service';
import { SOCKET } from '../socket/socket.enum';
import { SocketService } from '../socket/socket.service';
import { TrainingService } from '../training/training.service';
import { UnitService } from '../unit/unit.service';
import { UpgradeService } from '../upgrade/upgrade.service';
import { ICastle, ICastleDetail } from './castle.interface';

@Injectable({ providedIn: 'root' })
export class CastleService {
  httpClient = inject(HttpClient);
  router = inject(Router);

  socketService = inject(SocketService);
  resourceService = inject(ResourceService);
  buildingService = inject(BuildingService);
  unitService = inject(UnitService);
  trainingService = inject(TrainingService);
  upgradeService = inject(UpgradeService);

  getCastle$ = this.httpClient.get<Response<ICastle[]>>('/castles', {
    context: setNotToastSuccess,
  });

  castles: ICastle[] = [];

  get currentCastle() {
    return this.currentCastle$.value;
  }
  set currentCastle(castle: ICastleDetail | null) {
    this.currentCastle$.next(castle);
  }
  currentCastle$ = new BehaviorSubject<ICastleDetail | null>(null);

  population = {
    total: 0,
    used: 0,
    left: 0,
  };

  constructor() {
    combineLatest([
      this.buildingService.buildings$,
      this.unitService.units$,
    ]).subscribe(([_, units]) => {
      const population =
        this.buildingService.getBuildingByKey(DEFAULT_BUILDING.KEY.DWELLINGS)
          ?.upgrade.current.generate || 0;
      const populationUsed = units.reduce((prev, current) => {
        return current.default.population * current.total + prev;
      }, 0);
      this.population = {
        total: population,
        used: populationUsed,
        left: population - populationUsed,
      };
    });
  }

  init() {
    return this.getCastle$.pipe(
      switchMap(({ data: castles }) => {
        this.castles = castles;
        const capital = this.castles.find((o) => o.isCapital)?._id || '';
        return this.getDetail(capital);
      }),
      tap(({ data }) => {
        this.currentCastle = data;
      }),
      switchMap(() => {
        return this.router.navigate(['/castle']);
      })
    );
  }

  getDetail(id: string) {
    return this.httpClient
      .get<Response<ICastleDetail>>(`/castles/detail/${id}`, {
        context: setNotToastSuccess,
      })
      .pipe(
        tap(({ data }) => {
          this.socketService.socket.emit(SOCKET.EVENT.JOIN_CASTLE, data._id);
          this.resourceService.resources = data.resources;
          this.buildingService.buildings = data.buildings;
          this.unitService.replaceAll(data.units);
          this.trainingService.replaceAll(data.trainings);
          this.upgradeService.replaceAll(data.upgrades);
        })
      );
  }

  listen() {
    this.resourceService.listen();
    this.trainingService.listen();
    this.unitService.listen();
    this.buildingService.listen();
    this.upgradeService.listen();
  }
}
