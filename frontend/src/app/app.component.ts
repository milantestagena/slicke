import {
  Component,
  effect,
  inject,
  Injector,
  OnInit,
  runInInjectionContext,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { DynamicHostComponent } from './components/dinamic-host/dinamic-host.component';
import { NotificationComponent } from './components/notification/notification.component';

import { AppStore } from './store/app.store';
import { AuthService } from './services/auth.service';
import { User } from './models';
import { ViewChild } from '@angular/core';
import { CollectionsSidebarComponent } from './components/collections-sidebar/collections-sidebar.component';
import { UserCollection } from './models';
@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    CommonModule,
    LoginFormComponent,
    UserDetailsComponent,
    DynamicHostComponent,
    NotificationComponent,
    CollectionsSidebarComponent,
  ],
  providers: [],
})
export class AppComponent implements OnInit {
  store: any;
  data: any = {};
  user!: User;
  selectedCollection: UserCollection | null = null;
  private authService: AuthService = inject(AuthService);
  constructor() {
    this.store = inject(AppStore);
    const injector = inject(Injector);
    runInInjectionContext(injector, () => {
      effect(() => {
        this.user = this.store.getUser();
      });
    });
  }

  @ViewChild(DynamicHostComponent)
  dynamicHost!: DynamicHostComponent;

  onCollectionSelected(collection: UserCollection) {
    this.selectedCollection = collection;
    this.dynamicHost.loadCollection(collection);
  }

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.authService.loadUserRelatedData();
    }
  }

  logout() {
    this.authService.logout();
    window.location.reload();
  }
  onAddCollectionRequested() {
    this.dynamicHost.loadAddToCollectionComponent();
  }

  loadMailbox() {
    this.dynamicHost.loadMailbox();
  }

  onExchangeSelected(collection: UserCollection) {
    this.dynamicHost.loadExchange(collection);
  }

  onLoadProposals(collection: UserCollection) {
    this.dynamicHost.loadProposals(collection);
  }
}
