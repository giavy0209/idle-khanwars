import { HttpClient } from '@angular/common/http'
import { inject } from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'
import { PAGINATION, setNotToastSuccess } from 'app/http-interceptors/context'
import { IOtherUser } from 'app/shared/services/user/user.interface'
import { ToastrService } from 'ngx-toastr'
import { BehaviorSubject, switchMap, tap } from 'rxjs'
import { Response } from 'types'
import { IClanRequest, IClanWithOwner } from './clan.interface'

export class ClanService {
  httpClient = inject(HttpClient)
  toastr = inject(ToastrService)
  formBuilder = new FormBuilder().nonNullable
  form = this.formBuilder.group(
    {
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(12)
        ]
      ],
      description: [
        '',
        [
          Validators.minLength(0),
          Validators.maxLength(255)
        ]
      ]
    },
  )

  get pagination() {
    return this.pagination$.value
  }
  set pagination(pagination: Pagination) {
    this.pagination$.next(pagination)
  }
  pagination$ = new BehaviorSubject<Pagination>({ page: 1, limit: 10 })
  clans: IClanWithOwner[] = []
  totalClan = 0
  getClan$() {
    return this.pagination$.pipe(
      switchMap((pagination) => this.httpClient.get<Response<IClanWithOwner[]>>('/clans', { context: setNotToastSuccess.set(PAGINATION, pagination) }).pipe(
        tap(res => {
          this.clans = res.data
          this.totalClan = res.total || 0
        })
      ))
    )
  }

  get requestPagination() {
    return this.requestPagination$.value
  }
  set requestPagination(requestPagination: Pagination) {
    this.requestPagination$.next(requestPagination)
  }
  requestPagination$ = new BehaviorSubject<Pagination>({ page: 1, limit: 10 })
  requests: IClanRequest[] = []
  totalRequest = 0
  getClanRequest$() {
    return this.requestPagination$.pipe(
      switchMap((pagination) => this.httpClient.get<Response<IClanRequest[]>>(`/clans/request`, { context: setNotToastSuccess.set(PAGINATION, pagination) }).pipe(
        tap(res => {
          this.requests = res.data
          this.totalRequest = res.total || 0
        })
      ))
    )
  }

  get memberPagination() {
    return this.memberPagination$.value
  }
  set memberPagination(memberPagination: Pagination) {
    this.memberPagination$.next(memberPagination)
  }
  memberPagination$ = new BehaviorSubject<Pagination>({ page: 1, limit: 10 })
  members: IOtherUser[] = []
  totalMember: number = 0
  getClanMember$() {
    return this.memberPagination$.pipe(
      switchMap((pagination) => this.httpClient.get<Response<IOtherUser[]>>(`/clans/member`, { context: setNotToastSuccess.set(PAGINATION, pagination) }).pipe(
        tap(res => {
          this.members = res.data
          this.totalMember = res.total || 0
        })
      ))
    )
  }

  createClan() {
    const { name, description } = this.form.value
    if (!this.form.valid) {
      this.toastr.error('Please fill the form')
      return null
    } else {
      return this.httpClient.post('/clans', { name, description })
    }
  }

  joinOrCancel(clan: IClanWithOwner) {
    if (clan.isRequest) {
      return this.httpClient.delete(`/clans/request/${clan._id}`)
    } else {
      return this.httpClient.post(`/clans/request/${clan._id}`, {})
    }
  }

  approvalRequest(id: string, status: 'APPROVED' | 'REJECTED') {
    return this.httpClient.post<Response<unknown>>(`/clans/request/approval/${id}`, { status })
  }

  leave() {
    return this.httpClient.delete<Response<unknown>>('/clans')
  }

  kick(memberId: string) {
    return this.httpClient.delete(`/clans/member/${memberId}`)
  }
}