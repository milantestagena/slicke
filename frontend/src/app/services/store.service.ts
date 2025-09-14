import { inject, Injectable } from '@angular/core';
import { AppStore } from '../store/app.store';
import { HTTPService } from './http.service';
import { GetUrls } from '../enums';
import { catchError, EMPTY, map, of, take, tap } from 'rxjs';
import { Collection } from '../models';
import { CollectionService } from './collection.service';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  store: any;
  private httpService: HTTPService;
  private collectionService: CollectionService;
  constructor() {
    this.store = inject(AppStore);
    this.httpService = inject(HTTPService);
    this.collectionService = inject(CollectionService);
  }

  setUserFromSession(token: string) {
    this.httpService
      .getRequestWithAuth(GetUrls.GET_USER_FOR_SESSION, { token })
      .pipe(
        map((response: any) => {
          if (response.data) {
            this.store.setUser(response.data);
          }
        })
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
        })
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
        })
      )
      .subscribe();
  }

  getAllCollections() {
    this.collectionService.getAllCollections().pipe(
        map((r: { data: Collection[] }) => r.data),
        tap((list) => this.store.setCollections(list)),
        catchError(() => EMPTY)
      )
      .subscribe();
  }

  saveCollection(collection: Collection) {
    console.log('Saving collection:', collection);
    this.collectionService.saveCollection(collection).pipe(
        tap(() => this.getAllCollections()),
        catchError(() => EMPTY)
      )
      .subscribe();
  }
  deleteCollection(id: number) {
    this.collectionService.deleteCollection(id).pipe(
        tap(() => this.getAllCollections()),
        catchError(() => EMPTY)
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
        })
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
        })
      )
      .subscribe();
  }
}
