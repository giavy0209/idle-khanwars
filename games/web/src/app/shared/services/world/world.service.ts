import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { setNotToastSuccess } from 'app/http-interceptors/context';
import { Response } from 'types';
import { IWorld } from './world.interface';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WorldService {
  httpClient = inject(HttpClient);
  selectedWorld$ = new BehaviorSubject<IWorld | null>(null);
  worlds$ = new BehaviorSubject<IWorld[]>([]);
  constructor() {
    this.getWorld$.subscribe((response) => {
      const { data: worlds } = response;
      this.worlds$.next(worlds);
    });
  }
  getWorld$ = this.httpClient.get<Response<IWorld[]>>('/worlds', {
    context: setNotToastSuccess,
  });
}
