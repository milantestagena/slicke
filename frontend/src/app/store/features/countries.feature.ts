import { signalStoreFeature, withState, withMethods, withHooks, patchState } from '@ngrx/signals';
import { inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Country } from '../../models';
import { CountryService } from '../../services/country.service';
import { catchError, finalize, of, take } from 'rxjs';

interface CountryState {
  Countries: Country[];
  countriesLoading: boolean;
  countriesError: string | null;
}

const defaultCountryState = (): CountryState => ({
  Countries: [],
  countriesLoading: false,
  countriesError: null,
});

let countryService: CountryService;
let destroyRef: DestroyRef;

export const CountryFeature = signalStoreFeature(
  withState<CountryState>(defaultCountryState()),

  withHooks(() => ({
    onInit() {
      countryService = inject(CountryService);
      destroyRef = inject(DestroyRef);
      // opcionalno auto-load:
      // methods.loadCountries();
    },
  })),

  withMethods((store) => {
    const resetState = () => patchState(store, defaultCountryState());
    const load = () => {
      patchState(store, {
        countriesLoading: true,
        countriesError: null,
      });
      countryService
        .getCountries()
        .pipe(
          take(1),
          catchError(() => of<Country[]>([])),
          finalize(() =>
            patchState(store, { countriesLoading: false })
          ),
          takeUntilDestroyed(destroyRef)
        )
        .subscribe(list => patchState(store, { Countries: list }));
    };

    const methods = {
      setCountries(countries: Country[]) {
        patchState(store, { Countries: countries });
      },
      getCountries() {
        return store.Countries();
      },
      loadCountries: load,
      resetCountries: resetState,
    };

    return methods;
  })
);
