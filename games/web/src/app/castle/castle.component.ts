import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import { Router } from '@angular/router'
import { ResourceService } from 'app/shared/services/resource/resource.service'
import { UserService } from 'app/shared/services/user/user.service'
import { ActionComponent } from './action/action.component'
import { ResourceComponent } from './resource/resource.component'

@Component({
  selector: 'app-castle',
  standalone: true,
  imports: [CommonModule, ResourceComponent, ActionComponent],
  templateUrl: './castle.component.html',
  styleUrl: './castle.component.scss'
})
export class CastleComponent {
  userService = inject(UserService)
  resourceService = inject(ResourceService)
  router = inject(Router)

  ngOnInit() {

  }
}
