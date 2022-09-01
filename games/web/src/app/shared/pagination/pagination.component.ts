import { CommonModule } from '@angular/common'
import { Component, EventEmitter, Input, Output } from '@angular/core'
import { BehaviorSubject, combineLatest } from 'rxjs'
import { CreateArrayPipe } from '../pipes/create-array.pipe'

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule, CreateArrayPipe],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss'
})
export class PaginationComponent {
  @Input() currentPage = 1
  @Input()
  set total(total: number) {
    this.total$.next(total)
  }
  total$ = new BehaviorSubject(0)

  @Input()
  set itemCount(itemCount: number) {
    this.itemCount$.next(itemCount)
  }
  itemCount$ = new BehaviorSubject(10)

  @Output() onPagination = new EventEmitter<Pagination>()

  totalPage = 0
  ngOnInit() {
    combineLatest([
      this.total$,
      this.itemCount$
    ])
      .subscribe(([total, itemCount]) => {
        this.totalPage = Math.ceil(total / itemCount)
      })
  }

  onChangePage(page: number) {
    this.currentPage = page
    this.onPagination.emit({ page })
  }
}
