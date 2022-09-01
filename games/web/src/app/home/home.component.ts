import { CommonModule, } from '@angular/common'
import { Component, inject } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { Router } from '@angular/router'
import { StorageService } from 'app/shared/services/storage/storage.service'
import { WorldService } from 'app/shared/services/world/world.service'
import { ButtonComponent } from '../shared/components/button/button.component'
import { HomeService } from './home.service'


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ButtonComponent, ReactiveFormsModule],
  providers: [HomeService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  router = inject(Router)
  homeService = inject(HomeService)
  worldService = inject(WorldService)
  storageService = inject(StorageService)
  async ngOnInit() {
    const jwt = await this.storageService.getToken()
    console.log({ jwt })

    if (jwt) {
      this.router.navigateByUrl('/castle')
    }
  }
}
