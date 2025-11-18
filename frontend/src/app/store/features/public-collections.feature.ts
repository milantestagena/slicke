import {
  signalStoreFeature,
  withState,
  withMethods,
  patchState,
} from '@ngrx/signals';
import { Collection } from '../../models';

interface PublicCollectionsState {
  publicCollections: Collection[];
}

const defaultPublicCollectionsState = (): PublicCollectionsState => ({
  publicCollections: [],
});

export const PublicCollectionsFeature = signalStoreFeature(
  withState<PublicCollectionsState>(defaultPublicCollectionsState()),
  withMethods((store) => {
    const resetState = () => patchState(store, defaultPublicCollectionsState());

    return {
      setPublicCollections: (collections: Collection[]) =>
        patchState(store, { publicCollections: collections }),

      getPublicCollections: () => [...store.publicCollections()],

      clearPublicCollections: resetState,

      resetPublicCollections: resetState,
    };
  })
);
