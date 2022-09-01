import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import { ButtonComponent } from '../button/button.component'
import { ModalComponent } from '../modal/modal.component'
import { AlertService } from './alert.service'

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule, ModalComponent, ButtonComponent],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss'
})
export class AlertComponent {
  alertService = inject(AlertService)
}
