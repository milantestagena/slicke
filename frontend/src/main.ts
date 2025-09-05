import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideState, provideStore } from '@ngrx/store';
import { CollectionsFeature } from './app/store/features/collections.feature';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideRouter(routes),
    provideStore(CollectionsFeature),
    ...appConfig.providers,
  ],
}).catch((err) => console.error(err));
