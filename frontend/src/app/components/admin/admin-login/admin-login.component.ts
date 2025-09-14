import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss'],
})
export class AdminLoginComponent {
  username = '';
  password = '';
  error = '';

  private router = inject(Router);

  login() {

    if (this.username === 'admin' && this.password === 'admin') {
      const now = new Date();
      const expires = now.getTime() + 24 * 60 * 60 * 1000; // 1 dan
      localStorage.setItem('admin_token', expires.toString());
      this.router.navigate(['/admin']);
    } else {
      this.error = 'Invalid username or password';
    }
  }
}
