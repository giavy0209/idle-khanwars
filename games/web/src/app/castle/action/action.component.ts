import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import { RouterLink } from '@angular/router'
import { ButtonComponent } from 'app/shared/components/button/button.component'
import { UserService } from 'app/shared/services/user/user.service'

@Component({
  selector: 'app-action',
  standalone: true,
  imports: [CommonModule, ButtonComponent, RouterLink],
  templateUrl: './action.component.html',
  styleUrl: './action.component.scss'
})
export class ActionComponent {
  userService = inject(UserService)

}
