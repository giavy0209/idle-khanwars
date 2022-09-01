import { CommonModule } from '@angular/common'
import { Component, Input } from '@angular/core'

@Component({
  selector: 'app-time',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './time.component.html',
  styleUrl: './time.component.scss'
})
export class TimeComponent {
  @Input() seconds: number = 0

}
