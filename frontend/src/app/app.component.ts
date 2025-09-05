import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // 👈 dodaj ovo
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { AdminComponent } from './components/admin/admin.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {}
