import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, computed, inject } from '@angular/core';
import { UserCollection } from '../../models';
import { AuthService } from '../../services/auth.service';
import { AppStore } from '../../store/app.store';
import { CollectionsSidebarComponent } from '../collections-sidebar/collections-sidebar.component';
import { DynamicHostComponent } from '../dinamic-host/dinamic-host.component';
import { LoginFormComponent } from '../login-form/login-form.component';
import { NotificationComponent } from '../notification/notification.component';
import { UserDetailsComponent } from '../user-details/user-details.component';

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
})
export class HomeComponent implements OnInit {
  private readonly store = inject(AppStore);
  private readonly authService = inject(AuthService);

  readonly isLoggedIn = this.store.isAuthenticated;

  @ViewChild(DynamicHostComponent)
  dynamicHost!: DynamicHostComponent;

  ngOnInit(): void {
    const token = this.authService.getToken();
    if (token && this.authService.isAuthenticated()) {

      if (!this.store.user()?.id) {
        this.store.loadUserFromSession(token);
      }
        this.store.loadAllCollections();
        this.store.loadAvailableCollections();
        this.store.loadUserCollections();
      }
  }

  onCollectionSelected(collection: UserCollection) {
    this.dynamicHost.loadUserCollection(collection);
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

  logout() {
    this.authService.logout();
    window.location.reload();
  }
}
