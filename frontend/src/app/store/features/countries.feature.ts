import {
  signalStoreFeature,
  withState,
  withMethods,
  patchState,
  withHooks,
} from '@ngrx/signals';
import { Country } from '../../models';
import { inject, Injector, runInInjectionContext } from '@angular/core';
import { HTTPService } from '../../services/http.service';
import { GetUrls } from '../../enums';
import { map, take } from 'rxjs';

export const CountryFeature = signalStoreFeature(
  withState<{ Countries: Country[]  }>({ Countries: [] }),
  withMethods((store) => ({
    setCountries: (countries: Country[]) =>
      patchState(store, { Countries: countries }),
    getCountries: () => ({ ...store.Countries() })
  })),
  withHooks((store) => ({
    onInit() {
      const injector = inject(Injector);
      runInInjectionContext(injector, () => {
        const apiService: HTTPService = inject(HTTPService);
        apiService
          .getRequest(GetUrls.GET_ALL_COUNTRIES)
          .pipe(
            map((response) => {
              store.setCountries(response.data);
            }),
            take(1)
          )
          .subscribe();
      });
    },
  })),
);
