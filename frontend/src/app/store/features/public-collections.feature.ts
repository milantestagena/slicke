import {
  signalStoreFeature,
  withState,
  withMethods,
  patchState,
} from '@ngrx/signals';
import { Collection } from '../../models';

export const PublicCollectionsFeature = signalStoreFeature(
  withState<{ publicCollections: Collection[] }>({ publicCollections: [] }),
  withMethods((store) => ({
    setPublicCollections: (collections: Collection[]) =>
      patchState(store, { publicCollections: collections }),

    getPublicCollections: () => [...store.publicCollections()],

    clearPublicCollections: () => patchState(store, { publicCollections: [] }),
  }))
);
