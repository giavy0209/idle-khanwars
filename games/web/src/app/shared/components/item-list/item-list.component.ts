import { CommonModule } from '@angular/common'
import { Component, EventEmitter, Input, Output } from '@angular/core'
import { RouterLink } from '@angular/router'
import { ImageUrlPipe } from 'app/shared/pipes/image-url.pipe'
import { LayoutComponent } from '../layout/layout.component'
import { IItemList } from './item-list.interface'

@Component({
  selector: 'app-item-list',
  standalone: true,
  imports: [CommonModule, RouterLink, ImageUrlPipe, LayoutComponent],
  templateUrl: './item-list.component.html',
  styleUrl: './item-list.component.scss'
})
export class ItemListComponent {
  @Output() clickedItemEvent = new EventEmitter()
  @Input() data: IItemList[] | null = []

  @Input() title: string = ''

  onClickItem(id: string) {
    this.clickedItemEvent.emit(id)
  }
}
