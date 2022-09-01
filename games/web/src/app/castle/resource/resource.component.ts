import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import { DEFAULT_BUILDING } from 'app/shared/interfaces/default-building.interface'
import { ImageUrlPipe } from 'app/shared/pipes/image-url.pipe'
import { IBuilding } from 'app/shared/services/building/building.interface'
import { BuildingService } from 'app/shared/services/building/building.service'
import { ResourceService } from 'app/shared/services/resource/resource.service'

@Component({
  selector: 'app-resource',
  standalone: true,
  imports: [CommonModule, ImageUrlPipe],
  templateUrl: './resource.component.html',
  styleUrl: './resource.component.scss'
})
export class ResourceComponent {
  resourceService = inject(ResourceService)
  buildingService = inject(BuildingService)
  buildingStorage: IBuilding | undefined = undefined

  ngOnInit(): void {
    this.buildingService.buildings$.subscribe(() => {
      this.buildingStorage = this.buildingService.getBuildingByKey(DEFAULT_BUILDING.KEY.STORAGE)
    })
  }

}
