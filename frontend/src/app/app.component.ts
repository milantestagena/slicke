import {
  Component,
  effect,
  importProvidersFrom,
  inject,
  Injector,
  OnInit,
  runInInjectionContext,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { DynamicHostComponent } from './components/dinamic-host/dinamic-host.component';
import { NotificationComponent } from './components/notification/notification.component'; // ⬅️ dodaj

import { AppStore } from './store/app.store';
import { AuthService } from './services/auth.service';
import { User } from './models';

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
    NotificationComponent
  ],
  providers: [],
})
export class AppComponent implements OnInit {
  store: any;
  data: any = {};
  user!: User;

  constructor(private authService: AuthService) {
    this.store = inject(AppStore);
    const injector = inject(Injector);
    runInInjectionContext(injector, () => {
      effect(() => {
        this.user = this.store.getUser();
      });
    });
  }

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.authService.loadUserRelatedData();
    }
  }

  logout() {
    this.store.logout();
  }
}
