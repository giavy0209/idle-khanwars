import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import { Router, RouterLink, RouterOutlet } from '@angular/router'
import { BuildingDetailComponent } from './building-detail/building-detail.component'
import { AlertComponent } from './shared/components/alert/alert.component'
import { ModalComponent } from './shared/components/modal/modal.component'
import { CastleService } from './shared/services/castle/castle.service'
import { SocketService } from './shared/services/socket/socket.service'
import { StorageService } from './shared/services/storage/storage.service'
import { UserService } from './shared/services/user/user.service'
import { UnitDetailComponent } from './unit-detail/unit-detail.component'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, UnitDetailComponent, BuildingDetailComponent, ModalComponent, RouterOutlet, RouterLink, AlertComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'idle-khanwars-fe';
  router = inject(Router)
  castleService = inject(CastleService)
  storageService = inject(StorageService)
  userService = inject(UserService)
  socketService = inject(SocketService)
  async ngOnInit() {
    const jwt = this.storageService.getToken()
    console.log({ jwt })

    if (jwt) {
      this.userService.getCurrentUser$.subscribe()
    } else {
      this.router.navigate(['/'])
    }
    this.socketService.socket.on('connect', () => {
      this.castleService.listen()
    })
  }
}
