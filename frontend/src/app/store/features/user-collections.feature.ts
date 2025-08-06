import {
  signalStoreFeature,
  withState,
  withMethods,
  patchState,
} from '@ngrx/signals';
import { UserCollection } from '../../models';

export const UserCollectionsFeature = signalStoreFeature(
  withState<{ userCollections: UserCollection[] }>({ userCollections: [] }),
  withMethods((store) => ({
    setUserCollections: (collections: UserCollection[]) =>
      patchState(store, { userCollections: collections }),

    getUserCollections: () => [...store.userCollections()],

    updateUserCollection: (updated: UserCollection) =>
      patchState(store, {
        userCollections: store
          .userCollections()
          .map((c) => (c.id === updated.id ? updated : c)),
      }),

    clearUserCollections: () => patchState(store, { userCollections: [] }),
  }))
);
