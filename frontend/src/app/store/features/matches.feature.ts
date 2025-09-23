import { DestroyRef, inject, Injector } from '@angular/core';
import {
  signalStoreFeature,
  withState,
  withMethods,
  withHooks,
  patchState,
} from '@ngrx/signals';
import { MatchesService } from '../../services/matches.service';
import { ExchangeData } from '../../models/exchange-data';
import { catchError, map, of, take } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export interface MatchesState {
  exchangeData: ExchangeData[] | null;
  loading: boolean;
  currentCollectionId: number | null;
}

let matchesService: MatchesService;
let destroyRef: DestroyRef;
export const MatchesFeature = signalStoreFeature(
  withState<MatchesState>({
    exchangeData: null,
    loading: false,
    currentCollectionId: null,
  }),

  withHooks(() => ({
    onInit() {
      matchesService = inject(MatchesService);
      destroyRef = inject(DestroyRef);
    },
  })),

  withMethods((store) => ({
    loadExchangeForCollection(collectionId: number) {
      patchState(store, { loading: true, currentCollectionId: collectionId });
      matchesService
        .getExchangeForCollection(collectionId)
        .pipe(
          map((response: any) => {
            patchState(store, {
              exchangeData: response.data as ExchangeData[],
              loading: false,
            });
            return response.data as ExchangeData;
          }),
          catchError((error) => {
            console.error('Error loading exchange data:', error);
            return of(null);
          }),
          take(1),
          takeUntilDestroyed(destroyRef)
        )
        .subscribe();
    },

    clearExchange: () =>
      patchState(store, {
        exchangeData: null,
        currentCollectionId: null,
        loading: false,
      }),

    getExchangeCopy: () => ({ ...store.exchangeData() }),
  }))
);
