import { Pipe, PipeTransform } from '@angular/core'
import { ICastle } from '../services/castle/castle.interface'

@Pipe({
  name: 'capital',
  standalone: true,
})
export class CapitalPipe implements PipeTransform {
  transform(value: ICastle[], ...args: unknown[]): ICastle {
    return value.find(o => o.isCapital) as ICastle
  }

}
