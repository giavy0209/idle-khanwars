import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { setNotToastSuccess } from 'app/http-interceptors/context';
import { CastleService } from 'app/shared/services/castle/castle.service';
import { BehaviorSubject, switchMap, tap } from 'rxjs';
import { Response } from 'types';
import { ResourceService } from '../resource/resource.service';
import { SOCKET } from '../socket/socket.enum';
import { SocketService } from '../socket/socket.service';
import { StorageService } from '../storage/storage.service';
import { ISignIn, ISignInPayload, IUser } from './user.interface';
import { WorldService } from '../world/world.service';

@Injectable({ providedIn: 'root' })
export class UserService {
  httpClient = inject(HttpClient);
  storageService = inject(StorageService);
  socketService = inject(SocketService);
  resourceService = inject(ResourceService);
  castleService = inject(CastleService);
  worldService = inject(WorldService);
  router = inject(Router);
  getCurrentUser$ = this.httpClient
    .get<Response<IUser>>('/users', { context: setNotToastSuccess })
    .pipe(
      tap((res) => {
        this.user = res.data;
        this.worldService.selectedWorld$.next(res.data.world);
        this.listen();
      }),
      switchMap((user) => {
        if (user.data.isPlaceCastle) {
          return this.castleService.init();
        }
        return this.router.navigate(['/map']);
      })
    );
  get user() {
    return this.user$.value;
  }
  set user(user: IUser | null) {
    this.user$.next(user);
  }
  user$ = new BehaviorSubject<null | IUser>(null);

  listen() {
    this.socketService.socket.on(SOCKET.EVENT.USER, this.replace);
  }

  replace = (user: IUser) => {
    console.log({ user });

    this.user = user;
  };

  signIn(payload: ISignInPayload) {
    return this.httpClient
      .post<Response<ISignIn>>('/users/signin', payload)
      .pipe(
        tap(async ({ data }) => {
          this.storageService.setToken(data.token);
          this.socketService.socket.connect();
        }),
        switchMap(() => {
          return this.getCurrentUser$;
        })
      );
  }

  signUp(payload: ISignInPayload) {
    return this.httpClient.post('/users/signup', payload);
  }

  async signOut() {
    this.storageService.clearToken();
    this.socketService.socket.disconnect();
    this.resourceService.clear();
    await this.router.navigate(['/']);
  }
}
