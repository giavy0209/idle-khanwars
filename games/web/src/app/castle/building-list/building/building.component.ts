import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { DEFAULT_BUILDING } from 'app/shared/interfaces/default-building.interface';
import { ImageUrlPipe } from 'app/shared/pipes/image-url.pipe';
import { IBuilding } from 'app/shared/services/building/building.interface';
import { BuildingService } from 'app/shared/services/building/building.service';
import { ResourceService } from 'app/shared/services/resource/resource.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-building',
  standalone: true,
  imports: [CommonModule, ImageUrlPipe],
  templateUrl: './building.component.html',
  styleUrl: './building.component.scss',
})
export class BuildingComponent {
  buildingService = inject(BuildingService);
  resourceService = inject(ResourceService);
  @Input() width: number = 0;
  @Input() top: number = 0;
  @Input() left: number = 0;
  @Input() path: string = '';
  @Input() key!: DEFAULT_BUILDING.KEY;

  private imageUrl$ = new BehaviorSubject<string>('');
  get imageUrl() {
    return this.imageUrl$.value;
  }
  set imageUrl(value: string) {
    this.imageUrl$.next(value);
  }

  private style$ = new BehaviorSubject<string>('');
  get style() {
    return this.style$.value;
  }
  set style(value: string) {
    this.style$.next(value);
  }

  private isBuilded$ = new BehaviorSubject<boolean>(false);
  get isBuilded() {
    return this.isBuilded$.value;
  }
  set isBuilded(value: boolean) {
    this.isBuilded$.next(value);
  }

  private currentBuilding$ = new BehaviorSubject<IBuilding>(
    this.buildingService.getBuildingByKey(this.key)
  );
  get currentBuilding() {
    return this.currentBuilding$.value;
  }
  set currentBuilding(value: IBuilding) {
    this.currentBuilding$.next(value);
  }

  private isCanUpgrade$ = new BehaviorSubject<boolean>(false);
  get isCanUpgrade() {
    return this.isCanUpgrade$.value;
  }
  set isCanUpgrade(value: boolean) {
    this.isCanUpgrade$.next(value);
  }

  ngOnInit() {
    this.style = `width: ${this.width}%; top: ${this.top}%; left: ${this.left}%`;
    this.imageUrl = `http://localhost:3000/api/${this.path}/1.webp`;

    this.buildingService.buildings$.subscribe((buildings) => {
      this.currentBuilding = buildings.find(
        (building) => building.default.key === this.key
      )!;
      if (
        this.currentBuilding &&
        this.currentBuilding.upgrade.current.level > 0
      ) {
        this.isBuilded = true;
      }
    });

    this.currentBuilding$.subscribe((building) => {
      if (!building) return;
      const upgradeCosts = building.upgrade.next.resources;
      const currentResources = this.resourceService.resources;
      const isCanUpgrade = upgradeCosts.every((cost) => {
        const currentResource = currentResources.find(
          (resource) => resource.default._id === cost.type._id
        )!;
        return currentResource.value >= cost.value;
      });

      this.isCanUpgrade = isCanUpgrade;
    });
  }

  // upgradeService = inject(UpgradeService);
  // buildingService = inject(BuildingService);

  // isShowUpgrading = false;

  // buildings$: Observable<IItemList[]> = this.buildingService.buildings$.pipe(
  //   map(() =>
  //     this.buildingService
  //       .getBuildingsByType(
  //         this.building.toUpperCase() as DEFAULT_BUILDING.TYPE
  //       )
  //       .map((building) => ({
  //         _id: building._id,
  //         name: building.default.name,
  //         path: building.default.path,
  //         info: [
  //           {
  //             name: 'Level',
  //             value: building.upgrade.current.level,
  //           },
  //           {
  //             name: building.default.generate,
  //             value: building.upgrade.current.generate + building.default.unit,
  //           },
  //         ],
  //       }))
  //   )
  // );

  // upgrades$ = combineLatest([
  //   timer(0, 1000),
  //   this.upgradeService.upgrades$,
  // ]).pipe(
  //   map(([_, upgrades]) => {
  //     return upgrades.map((o) => ({
  //       ...o,
  //       end: (new Date(o.endAt).getTime() - Date.now()) / 1000,
  //     }));
  //   })
  // );

  // toggleTraining() {
  //   this.isShowUpgrading = !this.isShowUpgrading;
  // }

  // cancel(id: string) {
  //   this.upgradeService.cancel(id).subscribe();
  // }
}
