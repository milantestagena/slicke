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
          } else {
            throw new Error('Invalid credentials');
          }
        }),
        catchError((error) => {
          console.log('Error:', error);
          return of({});
        })
      )
      .subscribe();
  }
}
