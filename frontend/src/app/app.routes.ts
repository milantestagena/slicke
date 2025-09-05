// app.routes.ts

import { Routes } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { CollectionsFeature } from './store/features/collections.feature';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./components/admin/admin.component').then(
        (c) => c.AdminComponent
      )
  },
];
