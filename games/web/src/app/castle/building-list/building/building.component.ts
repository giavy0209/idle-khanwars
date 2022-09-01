import { CommonModule } from '@angular/common'
import { Component, Input, inject } from '@angular/core'
import { ItemListComponent } from 'app/shared/components/item-list/item-list.component'
import { IItemList } from 'app/shared/components/item-list/item-list.interface'
import { DEFAULT_BUILDING } from 'app/shared/interfaces/default-building.interface'
import { ImageUrlPipe } from 'app/shared/pipes/image-url.pipe'
import { SecondsToTimePipe } from 'app/shared/pipes/seconds-to-time.pipe'
import { BuildingService } from 'app/shared/services/building/building.service'
import { UpgradeService } from 'app/shared/services/upgrade/upgrade.service'
import { Observable, combineLatest, map, timer } from 'rxjs'

@Component({
  selector: 'app-building',
  standalone: true,
  imports: [CommonModule, ItemListComponent, ImageUrlPipe, SecondsToTimePipe],
  templateUrl: './building.component.html',
  styleUrl: './building.component.scss'
})
export class BuildingComponent {
  @Input() building!: DEFAULT_BUILDING.TYPE
  upgradeService = inject(UpgradeService)
  buildingService = inject(BuildingService)

  isShowUpgrading = false


  buildings$: Observable<IItemList[]> = this.buildingService.buildings$.pipe(
    map(() => this.buildingService.getBuildingsByType(this.building.toUpperCase() as DEFAULT_BUILDING.TYPE).map(building => ({
      _id: building._id,
      name: building.default.name,
      path: building.default.path,
      info: [
        {
          name: 'Level',
          value: building.upgrade.current.level
        },
        {
          name: building.default.generate,
          value: building.upgrade.current.generate + building.default.unit
        }
      ]
    })))
  )

  upgrades$ = combineLatest([
    timer(0, 1000),
    this.upgradeService.upgrades$
  ]).pipe(
    map(([_, upgrades]) => {
      return upgrades.map(o => ({
        ...o,
        end: (new Date(o.endAt).getTime() - Date.now()) / 1000
      }))
    })
  )

  toggleTraining() {
    this.isShowUpgrading = !this.isShowUpgrading
  }

  cancel(id: string) {
    this.upgradeService.cancel(id).subscribe()
  }
}
