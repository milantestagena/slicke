import {
  Component,
  effect,
  inject,
  Injector,
  runInInjectionContext,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HTTPService } from '../../services/http.service';
import { catchError, map, of } from 'rxjs';
import { AppStore } from '../../store/app.store';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-form',
  templateUrl: `./login-form.component.html`,
  styleUrls: ['./login-form.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class LoginFormComponent {
  email: string = '';
  password: string = '';
  store: any;
  private authService: AuthService = inject(AuthService);

  constructor(private httpService: HTTPService) {
    this.store = inject(AppStore);
  }

  onSubmit() {
    this.httpService
      .postRequest('login', { email: this.email, password: this.password })
      .pipe(
        map((response: any) => {
          if (response.data?.user) {
            this.store.setUser(response.data.user);
            localStorage.setItem('authToken', response.data.token);
            this.authService.loadUserRelatedData();
          } else {
            throw new Error('Invalid credentials');
          }
        }),
        catchError((error) => {
          return of({});
        })
      )
      .subscribe();
  }
}
