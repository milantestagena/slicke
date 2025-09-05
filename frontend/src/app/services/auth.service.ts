import { User } from '../models';
import { AppStore } from '../store/app.store';
import { inject, Injectable } from '@angular/core';
import { StoreService } from './store.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private store: any;
  private token: string = '';

  constructor(private storeService: StoreService) {
    this.store = inject(AppStore);
  }

  login(token: string, user: User) {
    this.store.setUser(user);
    localStorage.setItem('authToken', token);
  }

  logout() {
    localStorage.removeItem('authToken');
    this.store.logout();
  }

  isAuthenticated() {
    this.token = localStorage.getItem('authToken') || '';
    return !!this.token;
  }

  getUser() {
    return this.store.getUser();
  }

  getToken() {
    return localStorage.getItem('authToken');
  }

  loadUserRelatedData() {
    if (!this.getUser().id) {
      this.storeService.setUserFromSession(this.token);
      this.setUserStore();
    } else {
      this.setUserStore();
    }
  }

  private setUserStore() {
    this.storeService.getAvailableCollections();
    this.storeService.getUserCollections();
    this.storeService.getAllCollections();
  }
}
