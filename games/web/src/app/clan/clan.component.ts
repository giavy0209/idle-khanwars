import { CommonModule } from '@angular/common'
import { HttpClient } from '@angular/common/http'
import { Component, inject } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { Router } from '@angular/router'
import { AlertService } from 'app/shared/components/alert/alert.service'
import { ButtonComponent } from 'app/shared/components/button/button.component'
import { LayoutComponent } from 'app/shared/components/layout/layout.component'
import { ModalComponent } from 'app/shared/components/modal/modal.component'
import { PaginationComponent } from 'app/shared/pagination/pagination.component'
import { CapitalPipe } from 'app/shared/pipes/capital.pipe'
import { UserService } from 'app/shared/services/user/user.service'
import { switchMap, tap } from 'rxjs'
import { IClanWithOwner } from './clan.interface'
import { ClanService } from './clan.service'

@Component({
  selector: 'app-clan',
  standalone: true,
  imports: [CommonModule, ButtonComponent, ModalComponent, ReactiveFormsModule, LayoutComponent, PaginationComponent, CapitalPipe],
  providers: [ClanService],
  templateUrl: './clan.component.html',
  styleUrl: './clan.component.scss'
})
export class ClanComponent {
  httpClient = inject(HttpClient)
  userService = inject(UserService)
  clanService = inject(ClanService)
  alertService = inject(AlertService)
  router = inject(Router)


  isCreatingClan = false
  isShowClanRequest = false

  isOwner = this.userService.user?.clan?.owner === this.userService.user?._id
  ngOnInit() {
    this.userService.user$.subscribe(user => {
      this.isOwner = user?.clan?.owner === user?._id
      if (user?.clan) {
        this.clanService.getClanMember$().subscribe()

        if (this.isOwner) {
          this.clanService.getClanRequest$().subscribe()
        }
      } else {
        this.clanService.getClan$().subscribe()
      }
    })
  }

  createClan() {
    this.clanService.createClan()?.pipe(
      tap(() => this.isCreatingClan = false)
    ).subscribe()
  }

  approvalRequest(id: string, status: 'APPROVED' | 'REJECTED') {
    this.clanService.approvalRequest(id, status)
      .pipe(
        switchMap(() => this.clanService.getClanRequest$()),
        switchMap(() => this.clanService.getClanMember$())
      )
      .subscribe()
  }


  joinOrCancel(clan: IClanWithOwner) {
    this.clanService.joinOrCancel(clan)
      .pipe(
        switchMap(() => this.clanService.getClan$())
      )
      .subscribe()
  }

  leave() {
    this.alertService.toggleAlert({
      title: 'Are you sure?',
      body: this.isOwner ? 'All member will be abandon' : 'You cannot join another clan within 24hours',
      onOk: () => {
        this.clanService.leave()
          .pipe(
            switchMap(() => this.router.navigate(['/castle']))
          )
          .subscribe()
      },
    })
  }

  kick(memberId: string) {
    const member = this.clanService.members.find(o => o._id === memberId)
    if (!member) return
    this.alertService.toggleAlert({
      title: 'Are you sure?',
      body: `${member.username} will be kick out`,
      onOk: () => {
        this.clanService.kick(memberId)
          .pipe(
            switchMap(() => this.clanService.getClanMember$())
          )
          .subscribe()
      },
    })
  }

}
