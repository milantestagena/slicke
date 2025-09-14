import { inject, Injector } from '@angular/core';
import {
  signalStoreFeature,
  withState,
  withMethods,
  withHooks,
  patchState,
} from '@ngrx/signals';
import { MatchesService } from '../../services/matches.service';
import { ExchangeData } from '../../models/exchange-data';

export interface MatchesState {
  exchangeData: ExchangeData | null;
  loading: boolean;
  currentCollectionId: number | null;
}

let matchesService: MatchesService; // ⬅️ lokalna promenljiva

export const MatchesFeature = signalStoreFeature(
  withState<MatchesState>({
    exchangeData: null,
    loading: false,
    currentCollectionId: null,
  }),

  withHooks(() => ({
    onInit() {
      const injector = inject(Injector);
      matchesService = inject(MatchesService); // ⬅️ safe injection
    },
  })),

  withMethods((store) => ({
    loadExchangeForCollection: (collectionId: number) => {
      patchState(store, {
        loading: true,
        currentCollectionId: collectionId,
      });

      matchesService.getExchangeForCollection(collectionId, (data) => {
        patchState(store, {
          exchangeData: data,
          loading: false,
        });
      });
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
