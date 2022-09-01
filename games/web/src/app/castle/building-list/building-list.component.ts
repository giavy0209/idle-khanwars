import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { ItemListComponent } from 'app/shared/components/item-list/item-list.component'
import { IItemList } from 'app/shared/components/item-list/item-list.interface'
import { DEFAULT_BUILDING } from 'app/shared/interfaces/default-building.interface'

@Component({
  selector: 'app-building-list',
  standalone: true,
  imports: [CommonModule, ItemListComponent, RouterLink],
  templateUrl: './building-list.component.html',
  styleUrl: './building-list.component.scss'
})
export class BuildingListComponent {
  buildingType: IItemList[] = [
    {
      _id: '0',
      name: 'Building Army',
      path: 'current:///assets/images/icon/army.webp',
      router: DEFAULT_BUILDING.TYPE.BUILDING_ARMY.toLowerCase(),
    },
    {
      _id: '1',
      name: 'Building Resource',
      path: 'current:///assets/images/icon/resource.webp',
      router: DEFAULT_BUILDING.TYPE.RESOURCE.toLowerCase(),
    },
    {
      _id: '2',
      name: 'Accessible Building',
      path: 'current:///assets/images/icon/accessible.webp',
      router: DEFAULT_BUILDING.TYPE.ACCESSIBLE_BUILDING.toLowerCase(),
    },
    {
      _id: '3',
      name: 'Functional Building',
      path: 'current:///assets/images/icon/functional.webp',
      router: DEFAULT_BUILDING.TYPE.BUILDING.toLowerCase(),
    },
  ]
}
