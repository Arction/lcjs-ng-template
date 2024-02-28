import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private observable?: Observable<number>;

  constructor() {}

  public connect(): Observable<number> {
    if (!this.observable) {
      this.observable = this.create();
    }
    return this.observable;
  }

  private create(): Observable<number> {
    const ws = new WebSocket('ws://localhost:4201');
    ws.onopen = () => {
      console.log('WS connection successful');
    };
    const observable = new Observable((obs: Observer<number>) => {
      ws.onmessage = (msg) => {
        const value = Number(msg.data);
        obs.next(value);
      };
      ws.onerror = obs.error.bind(obs);
      ws.onclose = obs.complete.bind(obs);
      return ws.close.bind(ws);
    });
    return observable;
  }
}
