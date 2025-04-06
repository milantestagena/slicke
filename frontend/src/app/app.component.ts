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
import { AppStore } from './store/app.store';
import { User } from './models';

import { AuthService } from './services/auth.service';
import { DynamicHostComponent } from './components/dinamic-host/dinamic-host.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    LoginFormComponent,
    UserDetailsComponent,
    DynamicHostComponent,
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
