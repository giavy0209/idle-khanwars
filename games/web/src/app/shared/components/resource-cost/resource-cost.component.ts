import { CommonModule } from '@angular/common'
import { Component, EventEmitter, Input, Output, inject } from '@angular/core'
import { IResourceCost } from 'app/shared/interfaces/resource-cost.interface'
import { ImageUrlPipe } from 'app/shared/pipes/image-url.pipe'
import { IResource } from 'app/shared/services/resource/resource.interface'
import { ResourceService } from 'app/shared/services/resource/resource.service'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-resource-cost',
  standalone: true,
  imports: [CommonModule, ImageUrlPipe],
  templateUrl: './resource-cost.component.html',
  styleUrl: './resource-cost.component.scss'
})
export class ResourceCostComponent {
  @Output() changeMax = new EventEmitter()
  @Input()
  set resourcesCost(resourcesCost: IResourceCost[]) {
    this._resourcesCost = resourcesCost
    this.resources = this.mapResourcesCostWithCurrent(resourcesCost, this.resourceService.resources$.value)
  }
  private _resourcesCost: IResourceCost[] = []

  @Input() multiple: number = 1

  resourcesSubscription?: Subscription
  resourceService = inject(ResourceService)
  resources: (IResourceCost & { current: number })[] = []
  ngOnInit() {
    this.resourcesSubscription = this.resourceService.resources$.subscribe(value => {
      this.resources = this.mapResourcesCostWithCurrent(this._resourcesCost, value)
    })
  }

  mapResourcesCostWithCurrent(resourcesCost: IResourceCost[], current: IResource[]) {
    let max = Number.MAX_SAFE_INTEGER

    const _resourcesCost = resourcesCost?.map(cost => {
      const currentResource = current.find(o => o.default._id === cost.type._id)?.value || 0
      const _max = Math.floor(currentResource / cost.value)
      if (_max < max) max = _max
      return {
        ...cost,
        current: current.find(o => o.default._id === cost.type._id)?.value || 0
      }
    })
    this.changeMax.emit(max)
    return _resourcesCost
  }

  ngOnDestroy() {
    this.resourcesSubscription?.unsubscribe()
  }
}
