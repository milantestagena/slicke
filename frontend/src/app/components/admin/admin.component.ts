import { Component, ViewChild, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminLoginComponent } from './admin-login/admin-login.component';

import { AdminCollectionsSidebarComponent } from './admin-collections-sidebar/admin-collections-sidebar.component';
import { DynamicHostComponent } from '../dinamic-host/dinamic-host.component';
import { Collection } from '../../models';
import { CountryService } from '../../services/country.service';
import { NotificationComponent } from '../notification/notification.component';
import { AppStore } from '../../store/app.store';

const ADMIN_TOKEN_KEY = 'admin_token';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    AdminLoginComponent,
    AdminCollectionsSidebarComponent,
    DynamicHostComponent,
    NotificationComponent,
  ],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  providers: [],
})
export class AdminComponent implements OnInit {
  @ViewChild(DynamicHostComponent)
  dynamicHost!: DynamicHostComponent;


  private readonly store = inject(AppStore);
  private readonly countryService = inject(CountryService);

  readonly isLoggedIn = signal(this.hasValidToken());

  ngOnInit(): void {
    if (!this.isLoggedIn()) {
      return;
    }

    this.store.getCollections();
    this.store.loadCountries();
  }

  private hasValidToken(): boolean {
    const expiry = Number(localStorage.getItem(ADMIN_TOKEN_KEY));
    return Number.isFinite(expiry) && Date.now() < expiry;
  }

  logout(): void {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    this.isLoggedIn.set(false);
    location.reload();
  }

  onCollectionSelected(collection: Collection) {
    this.dynamicHost.loadCollection(collection);
  }

  onAddCollectionRequested() {
    this.dynamicHost.createCollection();
  }
}
