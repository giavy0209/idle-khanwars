import { Pipe, PipeTransform, inject } from '@angular/core'
import { ConfigService } from '../services/config/config.service'

@Pipe({
  name: 'imageUrl',
  standalone: true,
})
export class ImageUrlPipe implements PipeTransform {
  configService = inject(ConfigService)
  transform(value: string, ...args: unknown[]): unknown {
    if (value.includes('current://')) {
      return value.replace('current://', '')
    }
    return this.configService.API_URL + value
  }

}
