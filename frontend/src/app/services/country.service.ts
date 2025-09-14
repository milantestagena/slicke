import { inject, Injectable } from '@angular/core';
import { AppStore } from '../store/app.store';
import { HTTPService } from './http.service';
import { GetUrls } from '../enums';
import { catchError, map, of, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  store: any;

  constructor(private httpService: HTTPService) {
    this.store = inject(AppStore);
  }

  getCountries() {
    this.httpService
      .getRequestWithAuth(GetUrls.GET_ALL_COUNTRIES)
      .pipe(
        map((response: any) => {
          if (response.data) {
            this.store.setCountries(response.data);
          } else {
            throw new Error('Invalid credentials');
          }
        }),
        catchError((error) => {
          return of({});
        }),
        take(1)
      )
      .subscribe();
  }

}
