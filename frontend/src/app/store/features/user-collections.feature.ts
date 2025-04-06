import {
  signalStoreFeature,
  withState,
  withMethods,
  patchState,
  withHooks,
} from '@ngrx/signals';
import { Collection } from '../../models';

export const UserCollectionsFeature = signalStoreFeature(
  withState<{ UserCollections: Collection[]}>({ UserCollections: [] }),
  withMethods((store) => ({
    setUserCollections: (UserCollections: any) => patchState(store, { UserCollections: UserCollections }),
    getUserCollections: () => ({ ...store.UserCollections() }),
  })),
);

