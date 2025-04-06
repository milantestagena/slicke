import {
  signalStoreFeature,
  withState,
  withMethods,
  patchState,
  withHooks,
} from '@ngrx/signals';
import { Collection } from '../../models';

export const AvailableCollectionsFeature = signalStoreFeature(
  withState<{ AvailableCollections: Collection[]}>({ AvailableCollections: [] }),
  withMethods((store) => ({
    setAvailableCollections: (AvailableCollections: any) => patchState(store, { AvailableCollections: AvailableCollections }),
    getAvailableCollections: () => ({ ...store.AvailableCollections() }),
  })),
);

