import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { BuildingService } from 'app/shared/services/building/building.service';
import { BuildingComponent } from './building/building.component';
import { DEFAULT_BUILDING } from 'app/shared/interfaces/default-building.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-building-list',
  standalone: true,
  imports: [CommonModule, BuildingComponent],
  templateUrl: './building-list.component.html',
  styleUrl: './building-list.component.scss',
})
export class BuildingListComponent {
  buildingService = inject(BuildingService);
  buildings = [
    {
      width: 9,
      top: 28,
      left: 25,
      path: 'gold-mine',
      key: DEFAULT_BUILDING.KEY.GOLD_MIME,
    },
    {
      width: 9,
      top: 25,
      left: 34,
      path: 'iron-mine',
      key: DEFAULT_BUILDING.KEY.IRON_MINE,
    },
    {
      width: 9,
      top: 27,
      left: 53,
      path: 'lumberjack',
      key: DEFAULT_BUILDING.KEY.LUMBERJACKS,
    },
    {
      width: 9,
      top: 23,
      left: 62,
      path: 'farm',
      key: DEFAULT_BUILDING.KEY.FARMS,
    },
    {
      width: 9,
      top: 28,
      left: 72,
      path: 'shelter',
      key: DEFAULT_BUILDING.KEY.SHELTER,
    },
    {
      width: 8,
      top: 21,
      left: 44,
      path: 'barrack',
      key: DEFAULT_BUILDING.KEY.BARRACKS,
    },
    {
      width: 8,
      top: 31.4,
      left: 47.3,
      path: 'archer',
      key: DEFAULT_BUILDING.KEY.ARCHERY_RANGE,
    },
    {
      width: 8,
      top: 36,
      left: 25,
      path: 'infirmary',
      key: DEFAULT_BUILDING.KEY.INFIRMARY,
    },
    {
      width: 8,
      top: 34,
      left: 38,
      path: 'blacksmith',
      key: DEFAULT_BUILDING.KEY.BLACKSMITH,
    },
    {
      width: 10,
      top: 36.5,
      left: 46.5,
      path: 'order',
      key: DEFAULT_BUILDING.KEY.ORDER,
    },
    {
      width: 12,
      top: 36,
      left: 54,
      path: 'workshop',
      key: DEFAULT_BUILDING.KEY.WORKSHOP,
    },
    {
      width: 10,
      top: 39,
      left: 67,
      path: 'storage',
      key: DEFAULT_BUILDING.KEY.STORAGE,
    },
    {
      width: 7,
      top: 45,
      left: 23,
      path: 'dwellings',
      key: DEFAULT_BUILDING.KEY.DWELLINGS,
    },
    {
      width: 12,
      top: 50,
      left: 31,
      path: 'market',
      key: DEFAULT_BUILDING.KEY.MARKET,
    },
    {
      width: 60,
      top: 56,
      left: 21,
      path: 'wall',
      key: DEFAULT_BUILDING.KEY.WALL,
    },
    {
      width: 10,
      top: 48,
      left: 66,
      path: 'stable',
      key: DEFAULT_BUILDING.KEY.STABLES,
    },
  ];

  private router = inject(Router);

  backToCastle() {
    this.router.navigate(['/castle']);
  }
}
