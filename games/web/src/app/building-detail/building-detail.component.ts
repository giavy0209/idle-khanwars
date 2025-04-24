import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { ButtonComponent } from 'app/shared/components/button/button.component';
import { ModalComponent } from 'app/shared/components/modal/modal.component';
import { ResourceCostComponent } from 'app/shared/components/resource-cost/resource-cost.component';
import { SecondsToTimePipe } from 'app/shared/pipes/seconds-to-time.pipe';
import { BuildingService } from 'app/shared/services/building/building.service';
@Component({
  selector: 'app-building-detail',
  standalone: true,
  imports: [
    CommonModule,
    ModalComponent,
    ResourceCostComponent,
    ButtonComponent,
    SecondsToTimePipe,
  ],
  templateUrl: './building-detail.component.html',
})
export class BuildingDetailComponent {
  httpClient = inject(HttpClient);
  buildingService = inject(BuildingService);

  disableUpgrade = true;
  onClose() {
    this.buildingService.selectedBuilding$.next(undefined);
  }

  onChangeMax(max: number) {
    if (max === 0) {
      this.disableUpgrade = true;
    } else {
      this.disableUpgrade = false;
    }
  }

  upgrade() {
    if (!this.buildingService.selectedBuilding) {
      return;
    }
    this.httpClient
      .post(
        `/upgrades/building/${this.buildingService.selectedBuilding._id}`,
        {}
      )
      .subscribe();
  }
}
