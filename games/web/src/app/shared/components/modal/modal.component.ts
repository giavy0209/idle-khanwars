import { CommonModule } from '@angular/common'
import { Component, EventEmitter, Input, Output } from '@angular/core'
import { ButtonComponent } from '../button/button.component'

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {
  @Input() isShow?: boolean
  @Output() close = new EventEmitter();
  onClose() {
    this.close.emit()
  }
}
