import { Routes } from '@angular/router';
import { ArmyComponent } from './castle/army/army.component';
import { UnitComponent } from './castle/army/unit/unit.component';
import { BuildingListComponent } from './castle/building-list/building-list.component';
import { BuildingComponent } from './castle/building-list/building/building.component';
import { CastleComponent } from './castle/castle.component';
import { ClanComponent } from './clan/clan.component';
import { HomeComponent } from './home/home.component';
import { MapComponent } from './map/map.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'castle',
    component: CastleComponent,
  },
  {
    path: 'clan',
    component: ClanComponent,
  },
  {
    path: 'map',
    component: MapComponent,
  },
  {
    path: 'castle/army',
    component: ArmyComponent,
  },
  {
    path: 'castle/army/:building',
    component: UnitComponent,
  },
  {
    path: 'castle/building',
    component: BuildingListComponent,
  },
  {
    path: 'castle/building/:building',
    component: BuildingComponent,
  },
];
