import { Injectable } from '@angular/core'

@Injectable({ providedIn: 'root' })
export class AlertService {
  type: 'CONFIRM' | 'HIDDEN' = 'HIDDEN'
  title = 'Title'
  body = 'Body'

  onOk?: () => any
  onCancel?: () => any

  handleOk() {
    this.type = 'HIDDEN'
    this.onOk?.()
  }

  handleCancel() {
    this.type = 'HIDDEN'
    this.onCancel?.()
  }


  toggleAlert(
    {
      title,
      body,
      onOk,
      onCancel
    }: {
      title?: string
      body?: string
      onOk?: () => any
      onCancel?: () => any
    }
  ) {
    this.type = 'CONFIRM'
    if (title) this.title = title
    if (body) this.body = body
    if (onOk) this.onOk = onOk
    if (onCancel) this.onCancel = onCancel
  }
}