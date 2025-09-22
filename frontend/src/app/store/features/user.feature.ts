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
  loading: boolean;
  error: string | null;
}

let http: HTTPService;
let destroyRef: DestroyRef;

export const UserFeature = signalStoreFeature(
  withState<UserState>({
    user: null,
    loading: false,
    error: null,
  }),
  withHooks(() => ({
    onInit() {
      http = inject(HTTPService);
      destroyRef = inject(DestroyRef);
    },
  })),

  withComputed(({ user }) => ({
    isAuthenticated: computed(() => !!user()),
  })),

  withMethods((store) => ({
    setUser(user: User | null) {
      patchState(store, { user, error: null });
    },

    loadUserFromSession(token: string) {
      http
        .getRequestWithAuth(GetUrls.GET_USER_FOR_SESSION, { token })
        .pipe(
          takeUntilDestroyed(destroyRef),
          catchError(() => of({ data: null })),
          finalize(() => patchState(store, { loading: false }))
        )
        .subscribe((response: any) => {
          if (response?.data) {
            patchState(store, { user: response.data, error: null });
          } else {
            patchState(store, { user: null, error: 'unauthorized' });
          }
        });
    },

    logout() {
      patchState(store, { user: null, error: null });
    },
  }))
);
