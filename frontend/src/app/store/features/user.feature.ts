import {
  signalStoreFeature,
  withState,
  withMethods,
  withComputed,
  withHooks,
  patchState,
} from '@ngrx/signals';
import { inject, computed, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HTTPService } from '../../services/http.service';
import { GetUrls } from '../../enums';
import { User } from '../../models';
import { catchError, finalize, of } from 'rxjs';

interface UserState {
  user: User | null;
  userLoading: boolean;
  userError: string | null;
}

const defaultUserState = (): UserState => ({
  user: null,
  userLoading: false,
  userError: null,
});

let http: HTTPService;
let destroyRef: DestroyRef;

export const UserFeature = signalStoreFeature(
  withState<UserState>(defaultUserState()),
  withHooks(() => ({
    onInit() {
      http = inject(HTTPService);
      destroyRef = inject(DestroyRef);
    },
  })),

  withComputed(({ user }) => ({
    isAuthenticated: computed(() => !!user()),
  })),

  withMethods((store) => {
    const resetState = () => patchState(store, defaultUserState());

    return {
      setUser(user: User | null) {
        patchState(store, { user, userError: null });
      },

      loadUserFromSession(token: string) {
        http
          .getRequestWithAuth(GetUrls.GET_USER_FOR_SESSION, { token })
          .pipe(
            takeUntilDestroyed(destroyRef),
            catchError(() => of({ data: null })),
            finalize(() => patchState(store, { userLoading: false }))
          )
          .subscribe((response: any) => {
            if (response?.data) {
              patchState(store, { user: response.data, userError: null });
            } else {
              patchState(store, { user: null, userError: 'unauthorized' });
            }
          });
      },
      resetUser: resetState,
    };
  })
);
