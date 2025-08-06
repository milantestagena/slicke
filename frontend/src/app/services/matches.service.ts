import { Injectable, inject } from '@angular/core';
import { HTTPService } from './http.service';
import { catchError, map, of, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MatchesService {
  private httpService = inject(HTTPService);

  getExchangeForCollection(collectionId: number, callback: (data: any) => void) {
    this.httpService
      .getRequestWithAuth(`matches/${collectionId}`)
      .pipe(
        map((response: any) => response.data?.[0] ?? null),
        catchError((error) => {
          console.error('Error loading exchange data:', error);
          return of(null);
        }),
        take(1)
      )
      .subscribe((data) => {
        callback(data);
      });
  }
}
