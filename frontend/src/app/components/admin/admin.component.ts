import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminLoginComponent } from './admin-login/admin-login.component';

import { StoreService } from '../../services/store.service';
import { AppStore } from '../../store/app.store';
import { AdminCollectionsSidebarComponent } from './admin-collections-sidebar/admin-collections-sidebar.component';
import { CollectionFormComponentComponent } from './collection-form-component/collection-form-component.component';
import { DynamicHostComponent } from '../dinamic-host/dinamic-host.component';
import { Collection } from '../../models';
import { CountryService } from '../../services/country.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    AdminLoginComponent,
    AdminCollectionsSidebarComponent,
    DynamicHostComponent,
  ],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  providers: [],
})
export class AdminComponent implements OnInit {
  @ViewChild(DynamicHostComponent)
  dynamicHost!: DynamicHostComponent;

  store: any;
  isLoggedIn: boolean = false;

  constructor(private storeService: StoreService, private countryService: CountryService) {
    this.store = inject(AppStore);
  }

  ngOnInit() {
    this.isLoggedIn = this.checkLogin();
    this.storeService.getAllCollections();
    this.countryService.getCountries();
  }

  checkLogin(): boolean {
    const token = localStorage.getItem('admin_token');
    if (!token) return false;

    const now = new Date().getTime();
    const expiry = parseInt(token, 10);
    return now < expiry;
  }

  logout() {
    localStorage.removeItem('admin-token');
    location.reload();
  }

  onCollectionSelected(collection: Collection) {
    this.dynamicHost.loadCollection(collection);
  }

  onAddCollectionRequested() {
    this.dynamicHost.createCollection();
  }
}
