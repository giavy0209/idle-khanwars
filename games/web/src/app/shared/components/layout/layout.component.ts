import { CommonModule, Location } from '@angular/common'
import { Component, Input, inject } from '@angular/core'

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  @Input() title: string = ''
  location = inject(Location)
  back() {
    this.location.back()
  }
}
