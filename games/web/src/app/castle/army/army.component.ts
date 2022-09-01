import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import { RouterLink } from '@angular/router'
import { ItemListComponent } from 'app/shared/components/item-list/item-list.component'
import { IItemList } from 'app/shared/components/item-list/item-list.interface'
import { DEFAULT_BUILDING } from 'app/shared/interfaces/default-building.interface'
import { BuildingService } from 'app/shared/services/building/building.service'
import { Observable, map } from 'rxjs'

@Component({
  selector: 'app-army',
  standalone: true,
  imports: [CommonModule, RouterLink, ItemListComponent],
  templateUrl: './army.component.html',
  styleUrl: './army.component.scss'
})
export class ArmyComponent {
  buildingService = inject(BuildingService)
  buildings$: Observable<IItemList[]> = this.buildingService.buildings$.pipe(
    map(() => this.buildingService.getBuildingsByType(DEFAULT_BUILDING.TYPE.BUILDING_ARMY).map(data => ({
      _id: data._id,
      router: `/castle/army/${data.default.key.toLowerCase()}`,
      path: data.default.path,
      name: data.default.name
    })))
  )
}
