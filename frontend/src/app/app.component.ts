import { Component, OnInit } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { ApiService } from './api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [CommonModule],
  providers: [], // Remove provideHttpClient here
})
export class AppComponent implements OnInit {
  data: any = {};

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    console.log('Hello from AppComponent');
    this.apiService.getData().subscribe((response) => {
      this.data = response;
      console.log(this.data);
    });
  }
}

bootstrapApplication(AppComponent, {
  providers: [provideHttpClient()], // Add provideHttpClient here as well
});
