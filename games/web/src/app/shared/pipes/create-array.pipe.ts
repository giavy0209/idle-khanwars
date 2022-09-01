import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'createArray',
  standalone: true,
})
export class CreateArrayPipe implements PipeTransform {

  transform([start, end]: [number, number]): number[] {
    const arr = []
    for (let index = start;index <= end;index++) {
      arr.push(index)
    }

    return arr
  }

}
