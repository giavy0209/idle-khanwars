import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ItemListComponent } from 'app/shared/components/item-list/item-list.component';
import { BuildingService } from 'app/shared/services/building/building.service';

@Component({
  selector: 'app-building-list',
  standalone: true,
  imports: [CommonModule, ItemListComponent, RouterLink],
  templateUrl: './building-list.component.html',
  styleUrl: './building-list.component.scss',
})
export class BuildingListComponent {
  buildingService = inject(BuildingService);
  ngOnInit() {
    console.log(this.buildingService.buildings);
  }
}
