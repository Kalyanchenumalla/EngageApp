import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse
} from '@angular/common/http';

import { Observable, catchError, delay, finalize, identity, take } from 'rxjs';
import { BusyService } from '../_services/busy.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

  constructor(private busy: BusyService) {}
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.busy.busy();

    return next.handle(req).pipe(
      (environment.production ? identity:  delay(1000)),
      finalize(() => {
        this.busy.idle();
      })
    )
  }
}
