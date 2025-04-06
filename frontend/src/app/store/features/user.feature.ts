import {
  signalStoreFeature,
  withState,
  withMethods,
  patchState,
} from '@ngrx/signals';
import { User } from '../../models';

export const UserFeature = signalStoreFeature(
  withState<{ User: User | null }>({ User: null }),
  withMethods((store) => ({
    setUser: (user: any) => patchState(store, { User: user }),
    getUser: () => ({ ...store.User() }),
    logout: () => patchState(store, { User: null }),
  }))
);
