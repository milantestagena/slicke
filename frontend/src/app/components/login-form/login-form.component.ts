import { Component, inject } from '@angular/core';
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
  email = '';
  password = '';

  private readonly store = inject(AppStore);
  private readonly httpService = inject(HTTPService);
  private readonly authService = inject(AuthService);

  onSubmit() {
    this.httpService
      .postRequest('login', { email: this.email, password: this.password })
      .pipe(
        map((response: any) => {
          const user = response.data?.user;
          if (!user) {
            throw new Error('Invalid credentials');
          }

          this.store.setUser(user);
          localStorage.setItem('authToken', response.data.token);
          this.authService.loadUserRelatedData();
        }),
        catchError(() => of({}))
      )
      .subscribe();
  }
}
