import { inject, Injectable } from '@angular/core';
import { AppStore } from '../store/app.store';
import { HTTPService } from './http.service';
import { GetUrls } from '../enums';
import { catchError, map, of, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  store: any;

  constructor(private httpService: HTTPService) {
    this.store = inject(AppStore);
  }

  setUserFromSession(token: string) {
    this.httpService
      .getRequestWithAuth(GetUrls.GET_USER_FOR_SESSION, { token })
      .pipe(
        map((response: any) => {
          if (response.data) {
            this.store.setUser(response.data);
          }
        }),
        take(1)
      )
      .subscribe();
  }

  getAvailableCollections() {
    this.httpService
      .getRequestWithAuth(GetUrls.GET_AVAILABLE_COLLECTION)
      .pipe(
        map((response: any) => {
          if (response.data) {
            this.store.setAvailableCollections(response.data);
          } else {
            throw new Error('Invalid credentials');
          }
        }),
        catchError((error) => {
          console.log('Error:', error);
          return of({});
        }),
        take(1)
      )
      .subscribe();
  }

  getUserCollections() {
    this.httpService
      .getRequestWithAuth(GetUrls.GET_USER_COLLECTIONS)
      .pipe(
        map((response: any) => {
          if (response.data) {
            this.store.setUserCollections(response.data);
          } else {
            throw new Error('Invalid credentials');
          }
        }),
        catchError((error) => {
          console.log('Error:', error);
          return of({});
        }),
        take(1)
      )
      .subscribe();
  }

  getConversations() {
    this.httpService
      .getRequestWithAuth(GetUrls.GET_CONVERSATIONS)
      .pipe(
        map((response: any) => {
          if (response.data) {
            this.store.setConversations(response.data);
          } else {
            throw new Error('Invalid credentials');
          }
        }),
        catchError((error) => {
          console.log('Error:', error);
          return of({});
        }),
        take(1)
      )
      .subscribe();
  }
  getConversationWithUser(corenspondentId: number) {
    this.httpService
      .getRequestWithAuth(
        `${GetUrls.GET_CONVERSATION_WITH_USER}/${corenspondentId}`
      )
      .pipe(
        map((response: any) => {
          if (response.data) {
            this.store.setConversationWithUser(corenspondentId, response.data);
          } else {
            throw new Error('Invalid credentials');
          }
        }),
        catchError((error) => {
          console.log('Error:', error);
          return of({});
        }),
        take(1)
      )
      .subscribe();
  }
}
