// src/app/store/features/collections.feature.ts

import {
  signalStoreFeature,
  withState,
  withMethods,
  withHooks,
  patchState,
  withComputed,
} from '@ngrx/signals';
import {
  computed,
  inject,
  Injector,
  runInInjectionContext,
} from '@angular/core';
import { Collection } from '../../models';
import { HTTPService } from '../../services/http.service';
import { GetUrls } from '../../enums';
import { map, take } from 'rxjs';

export const CollectionsFeature = signalStoreFeature(
  withState<{ collections: Collection[] }>({ collections: [] }),
  withComputed((state) => ({
    collections$: computed(() => state.collections),
  })),
  withMethods((store) => ({
    setCollections: (collections: Collection[]) =>
      patchState(store, { collections }),

    getCollections: () => [...store.collections()],
  }))
);
