import { CommonModule } from '@angular/common'
import { Component, EventEmitter, Input, Output } from '@angular/core'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { map } from 'rxjs'

@Component({
  selector: 'app-input-number',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './input-number.component.html',
  styleUrl: './input-number.component.scss'
})
export class InputNumberComponent {
  @Output() changeValue = new EventEmitter()
  @Input() min = 1
  @Input() max: number = Number.MAX_SAFE_INTEGER

  @Input()
  set value(value: number) {
    this._value = value
    this.input.setValue(value)
  }
  private _value = this.min
  input = new FormControl(1);
  ngOnInit() {
    this.input.valueChanges.pipe(
      map(value => {
        let num = Number(value)
        if (num < this.min) num = this.min
        if (num > (this.max)) num = this.max
        return num
      })
    ).subscribe(value => {
      this.input.setValue(value, { emitEvent: false })
      this._value = value
      this.changeValue.emit(this._value)
    })
  }
}
