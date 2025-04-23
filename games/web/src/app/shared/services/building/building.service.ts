import { Injectable, inject } from '@angular/core';
import { DEFAULT_BUILDING } from 'app/shared/interfaces/default-building.interface';
import { BehaviorSubject } from 'rxjs';
import { SOCKET } from '../socket/socket.enum';
import { SocketService } from '../socket/socket.service';
import { IBuilding } from './building.interface';

@Injectable({ providedIn: 'root' })
export class BuildingService {
  socketService = inject(SocketService);
  set buildings(buildings: IBuilding[]) {
    this.buildings$.next(buildings);
  }
  get buildings() {
    return this.buildings$.value;
  }
  buildings$ = new BehaviorSubject<IBuilding[]>([]);

  get selectedBuilding() {
    return this.selectedBuilding$.value;
  }
  set selectedBuilding(building: IBuilding | undefined) {
    this.selectedBuilding$.next(building);
  }
  selectedBuilding$ = new BehaviorSubject<IBuilding | undefined>(undefined);

  listen() {
    this.socketService.socket.on(SOCKET.EVENT.BUILDING, this.replace);
  }

  getBuildingByKey(key: DEFAULT_BUILDING.KEY): IBuilding {
    return this.buildings.find((building) => building.default.key === key)!;
  }

  getBuildingsByType(type: DEFAULT_BUILDING.TYPE) {
    return this.buildings.filter((building) => building.default.type === type);
  }

  replace = (building: IBuilding) => {
    const buildings = this.buildings;
    const index = buildings.findIndex((b) => b._id === building._id);
    if (index === -1) return;
    buildings.splice(index, 1, building);
    this.buildings = buildings;

    if (this.selectedBuilding?._id === building._id) {
      this.selectedBuilding = building;
    }
  };

  selectBuilding(id: string) {
    const building = this.buildings.find((o) => o._id === id);
    if (!building) return;
    this.selectedBuilding$.next(building);
  }

  clear() {
    this.buildings = [];
  }
}
