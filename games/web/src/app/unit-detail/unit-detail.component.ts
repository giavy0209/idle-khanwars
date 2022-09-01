import { CommonModule } from '@angular/common'
import { HttpClient } from '@angular/common/http'
import { Component, inject } from '@angular/core'
import { ButtonComponent } from 'app/shared/components/button/button.component'
import { InputNumberComponent } from 'app/shared/components/input-number/input-number.component'
import { ModalComponent } from 'app/shared/components/modal/modal.component'
import { ResourceCostComponent } from 'app/shared/components/resource-cost/resource-cost.component'
import { SecondsToTimePipe } from 'app/shared/pipes/seconds-to-time.pipe'
import { CastleService } from 'app/shared/services/castle/castle.service'
import { IUnitFully } from 'app/shared/services/unit/unit.interface'
import { UnitService } from 'app/shared/services/unit/unit.service'
import { Subscription } from 'rxjs'
@Component({
  selector: 'app-unit-detail',
  standalone: true,
  imports: [CommonModule, ModalComponent, ResourceCostComponent, InputNumberComponent, ButtonComponent, SecondsToTimePipe],
  templateUrl: './unit-detail.component.html',
  styleUrl: './unit-detail.component.scss'
})
export class UnitDetailComponent {
  httpClient = inject(HttpClient)
  unitService = inject(UnitService)
  castleService = inject(CastleService)
  unit: IUnitFully | undefined
  total = 1
  max = 1
  subscription = new Subscription()
  disableTraining = true

  onClose() {
    this.unitService.selectedUnit$.next(undefined)
  }
  ngOnInit() {
    const subscription = this.unitService.selectedUnit$.subscribe(this.handleChangeUnit)
    this.subscription.add(subscription)
  }
  ngOnDestroy() {
    this.subscription.unsubscribe()
  }
  handleChangeUnit = (unit?: IUnitFully) => {
    this.unit = unit
    this.total = 1
    this.disableTraining = this.total === 0 || this.unit?.building.upgrade.current.level === 0
  }

  setMax() {
    this.total = this.max
  }
  onChangeTotal(total: number) {
    this.total = total
  }

  changeMax(value: number) {
    const population = this.unit?.default.population || 1
    const max = Math.floor(this.castleService.population.left / population)
    this.max = max < value ? max : value
  }

  train() {
    if (!this.unit) return
    this.httpClient.post('/trainings', { unit: this.unit._id, total: this.total })
      .subscribe()
  }
}
