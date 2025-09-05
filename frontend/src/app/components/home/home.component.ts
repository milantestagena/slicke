import {
  Component,
  effect,
  inject,
  Injector,
  OnInit,
  runInInjectionContext,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginFormComponent } from '../login-form/login-form.component';
import { UserDetailsComponent } from '../user-details/user-details.component';
import { DynamicHostComponent } from '../dinamic-host/dinamic-host.component';
import { NotificationComponent } from '../notification/notification.component';

import { AppStore } from '../../store/app.store';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models';
import { ViewChild } from '@angular/core';
import { CollectionsSidebarComponent } from '../collections-sidebar/collections-sidebar.component';
import { UserCollection } from '../../models';
@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
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
export class HomeComponent implements OnInit {
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
    this.dynamicHost.loadUserCollection(collection);
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
