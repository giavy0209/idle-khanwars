import { Injectable, inject } from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { SocketService } from 'app/shared/services/socket/socket.service'
import { ISignInPayload } from 'app/shared/services/user/user.interface'
import { UserService } from 'app/shared/services/user/user.service'
import { ToastrService } from 'ngx-toastr'

@Injectable()
export class HomeService {
  toastr = inject(ToastrService)
  userService = inject(UserService)
  socketService = inject(SocketService)
  formBuilder = new FormBuilder().nonNullable
  form = this.formBuilder.group(
    {
      username: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(12),
        ]
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(12),
        ]
      ],
      world: [
        '',
        [
          Validators.required,
        ]
      ]
    },
  )
  router = inject(Router)
  async signIn() {
    const { username, password, world } = this.form.value as ISignInPayload
    if (!this.form.valid) {
      this.toastr.error('Please fill the form')
    } else {
      this.userService.signIn({ username, password, world }).subscribe()
    }
  }

  signUp() {
    console.log(this.form.controls.username.errors)

    const { username, password, world } = this.form.value as ISignInPayload
    if (!this.form.valid) {
      this.toastr.error('Please fill the form')
    } else {
      this.userService.signUp({ username, password, world }).subscribe()
    }
  }
}