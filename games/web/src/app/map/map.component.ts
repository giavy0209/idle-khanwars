import { CommonModule } from '@angular/common'
import { HttpClient } from '@angular/common/http'
import { Component, ElementRef, ViewChild, inject } from '@angular/core'
import { Router } from '@angular/router'
import { NgIconComponent } from '@ng-icons/core'
import { ButtonComponent } from 'app/shared/components/button/button.component'
import { ICastleDetail } from 'app/shared/services/castle/castle.interface'
import { CastleService } from 'app/shared/services/castle/castle.service'
import { UserService } from 'app/shared/services/user/user.service'
import { BehaviorSubject, combineLatest, switchMap } from 'rxjs'

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, NgIconComponent, ButtonComponent],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent {
  width = 1000
  height = 1000

  httpClient = inject(HttpClient)
  router = inject(Router)
  userService = inject(UserService)
  castleService = inject(CastleService)

  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>

  context!: CanvasRenderingContext2D
  size$ = new BehaviorSubject(10)
  arrayX$ = new BehaviorSubject<number[]>([])
  arrayY$ = new BehaviorSubject<number[]>([])
  center$ = new BehaviorSubject({ x: 0, y: 0 })
  selectedGrid$ = new BehaviorSubject<null | { x: number, y: number }>(null)

  castleImg = new Image();
  placeCastle() {
    if (!this.selectedGrid$.value) return
    this.httpClient.post('/castles', this.selectedGrid$.value)
      .pipe(
        switchMap(() => this.castleService.init()),
        switchMap(() => this.userService.getCurrentUser$)
      )
      .subscribe()
  }
  onClickMap(event: MouseEvent) {
    const { offsetWidth, offsetHeight } = this.canvas.nativeElement
    const { offsetX, offsetY } = event
    const percentWidth = offsetX / offsetWidth
    const percentHeight = offsetY / offsetHeight
    const x = this.width * percentWidth
    const y = this.height * percentHeight
    const gridSize = this.width / this.size$.value

    const xIndex = Math.floor(x / gridSize)
    const yIndex = Math.floor(y / gridSize)

    this.selectedGrid$.next({ x: this.arrayX$.value[xIndex], y: this.arrayY$.value[yIndex] })
  }

  ngAfterViewInit() {
    this.castleImg.src = '/assets/images/icon/castle.webp'
    this.castleImg.onload = () => {
      this.context = this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D
      this.update()
    }
  }

  changeSize(value: 1 | -1) {
    const newValue = this.size$.value + value
    if (newValue >= 5 && newValue <= 20) {
      this.size$.next(this.size$.value + value)
    }
  }

  updateArray(size: number, x: number, y: number,) {
    const arrayX = []
    const haftSize = Math.floor(size / 2)

    for (let index = x - haftSize; index < x + size - haftSize; index++) {
      arrayX.push(index)
    }
    this.arrayX$.next(arrayX)

    const arrayY = []
    for (let index = y - haftSize; index < y + size - haftSize; index++) {
      arrayY.push(index)
    }
    this.arrayY$.next(arrayY)
  }

  changeX(value: 1 | -1) {
    this.center$.next({ x: this.center$.value.x + value, y: this.center$.value.y })
  }

  changeY(value: 1 | -1) {
    this.center$.next({ x: this.center$.value.x, y: this.center$.value.y + value })
  }

  update() {
    this.castleService.currentCastle$.subscribe((castle) => {
      if (!castle) return
      const { coordinate: { x, y } } = castle
      this.center$.next({ x, y })
    })

    combineLatest([this.size$, this.center$,])
      .subscribe(([size, center]) => {
        this.updateArray(size, center.x, center.y)
      })

    combineLatest([
      this.size$,
      this.arrayX$,
      this.arrayY$,
      this.selectedGrid$,
    ])
      .subscribe(() => {
        this.draw(this.castleService.currentCastle)
      })
  }

  draw(
    castle: ICastleDetail | null
  ) {
    const { x, y } = castle?.coordinate || { x: 0, y: 0 }
    this.context.clearRect(0, 0, this.width, this.height)
    const gap = this.width / this.size$.value
    for (let index = 1; index < this.size$.value; index++) {
      this.context.beginPath()
      this.context.strokeStyle = '#000'
      this.context.lineWidth = 5
      this.context.moveTo(gap * index, 0)
      this.context.lineTo(gap * index, this.height)
      this.context.stroke()

      this.context.moveTo(0, gap * index)
      this.context.lineTo(this.width, gap * index)
      this.context.stroke()
      this.context.closePath()
    }

    if (castle) {
      this.context.drawImage(
        this.castleImg,
        (x - this.arrayX$.value[0]) * gap,
        (y - this.arrayY$.value[0]) * gap,
        gap,
        gap
      )
    }


    const selectedGrid = this.selectedGrid$.value
    if (selectedGrid) {
      const { x, y } = selectedGrid
      const xIndex = this.arrayX$.value.findIndex(value => value === x)
      const yIndex = this.arrayY$.value.findIndex(value => value === y)

      this.context.beginPath()
      this.context.strokeStyle = '#007191'
      this.context.rect(xIndex * gap, yIndex * gap, gap, gap)
      this.context.stroke()
      this.context.closePath()
    }
  }

  back() {
    if (this.userService.user?.isPlaceCastle) {
      this.router.navigate(['/castle'])
    }
  }
}
