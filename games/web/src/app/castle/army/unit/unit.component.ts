import { CommonModule } from '@angular/common'
import { Component, Input, inject } from '@angular/core'
import { ButtonComponent } from 'app/shared/components/button/button.component'
import { ItemListComponent } from 'app/shared/components/item-list/item-list.component'
import { IItemList } from 'app/shared/components/item-list/item-list.interface'
import { DEFAULT_BUILDING } from 'app/shared/interfaces/default-building.interface'
import { ImageUrlPipe } from 'app/shared/pipes/image-url.pipe'
import { TrainingService } from 'app/shared/services/training/training.service'
import { UnitService } from 'app/shared/services/unit/unit.service'
import { UtilsService } from 'app/shared/services/utils/utils.service'
import { Observable, combineLatest, map, timer } from 'rxjs'

@Component({
  selector: 'app-unit',
  standalone: true,
  imports: [CommonModule, ButtonComponent, ItemListComponent, ImageUrlPipe],
  templateUrl: './unit.component.html',
  styleUrl: './unit.component.scss'
})
export class UnitComponent {
  @Input() building!: string
  utilsService = inject(UtilsService)
  unitService = inject(UnitService)
  trainingService = inject(TrainingService)
  trainings$ = combineLatest([
    timer(0, 1000),
    this.trainingService.trainings$
  ]).pipe(
    map(() => {
      let totalUnit = 0
      const training = this.trainingService.getTrainingsByBuilding(this.building.toUpperCase() as DEFAULT_BUILDING.KEY).map(training => {
        totalUnit += training.left
        return {
          ...training,
          next: this.utilsService.secondsToTime((new Date(training.nextAt).getTime() - Date.now()) / 1000),
          end: this.utilsService.secondsToTime((new Date(training.endAt).getTime() - Date.now()) / 1000),
        }
      })
      this.totalUnit = totalUnit
      return training

    })
  )
  units$: Observable<IItemList[]> = this.unitService.units$.pipe(
    map(() => {
      return this.unitService.getUnitsByBuilding(this.building.toUpperCase() as DEFAULT_BUILDING.KEY).map(unit => ({
        _id: unit._id,
        name: unit.default.name,
        path: unit.default.path,
        info: [
          {
            name: 'Total',
            value: unit.total
          },
          {
            name: 'In Tower',
            value: unit.inTower
          }
        ],

      }))
    })
  )
  isShowTraining = false
  totalUnit = 0
  toggleTraining() {
    this.isShowTraining = !this.isShowTraining
    console.log(this.isShowTraining)
  }
}
