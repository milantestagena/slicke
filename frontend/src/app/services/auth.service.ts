import { User } from '../models';
import { AppStore } from '../store/app.store';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private store = inject(AppStore);
  private token: string = '';

  constructor() {
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

  getToken() {
    return localStorage.getItem('authToken');
  }

  loadUserRelatedData() {
    if (!this.store.user()?.id) {
      this.store.loadUserFromSession(this.token);
      this.setUserStore();
    } else {
      this.setUserStore();
    }
  }

  private setUserStore() {
    this.store.loadAllCollections( );
    this.store.loadAvailableCollections();
  }
}
