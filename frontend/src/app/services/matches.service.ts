import { Injectable, inject } from '@angular/core';
import { HTTPService } from './http.service';
import { catchError, map, of, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MatchesService {
  private httpService = inject(HTTPService);

  getExchangeForCollection(collectionId: number) {
    return this.httpService.getRequestWithAuth(`matches/${collectionId}`);
  }
}
