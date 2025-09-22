import {
  signalStoreFeature,
  withState,
  withMethods,
  withHooks,
  patchState,
} from '@ngrx/signals';
import { inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UserCollection } from '../../models';
import { catchError, finalize, map, of, take, tap } from 'rxjs';
import { UserCollectionService } from '../../services/user-collection.service';

interface UserCollectionsState {
  userCollections: UserCollection[];
  loading: boolean;
  error: string | null;
}

let destroyRef: DestroyRef;
let userCollectionService: UserCollectionService;

export const UserCollectionsFeature = signalStoreFeature(
  withState<UserCollectionsState>({
    userCollections: [],
    loading: false,
    error: null,
  }),

  withHooks(() => ({
    onInit() {
      userCollectionService = inject(UserCollectionService);
      destroyRef = inject(DestroyRef);
    },
  })),

  withMethods((store) => {
    const reload = () => {
      patchState(store, { loading: true, error: null });
      userCollectionService
        .getUserCollections()
        .pipe(
          take(1),
          map((r: any) => r?.data ?? []),
          catchError(() => {
            patchState(store, { error: 'load user collections failed' });
            return of<UserCollection[]>([]);
          }),
          finalize(() => patchState(store, { loading: false })),
          takeUntilDestroyed(destroyRef)
        )
        .subscribe((list) => {
          patchState(store, { userCollections: list });
        });
    };

    return {
      // setter
      setUserCollections(collections: UserCollection[]) {
        patchState(store, { userCollections: collections });
      },

      // getter (zadržavam tvoje ime i ponašanje)
      getUserCollections() {
        return [...store.userCollections()];
      },

      // update pojedinačne kolekcije

      updateUserCollection(id: number | string, data: any) {
        userCollectionService
          .updateUserCollection(id, data)
          .pipe(
            take(1),
            map((r: any) => (r?.data as UserCollection) ?? null),
            tap((updated) => {
              if (updated) {
                const updatedCollections = store
                  .userCollections()
                  .map((collection) => {
                    if (collection.id === id) {
                      return {
                        ...collection,
                        items: collection.items.map((item: any) => {
                          Object.keys(data.items).forEach((key) => {
                            console.log(key, data.items[key], item);
                            if (item.id === +key) {
                              item.counter = data.items[key];
                            }
                          });
                          return item;
                        }),
                      };
                    }
                    return collection;
                  });
                patchState(store, { userCollections: updatedCollections });
              }
            }),
            catchError((err) => {
              console.error('updateUserCollection failed', err);
              return of(null);
            }),

            takeUntilDestroyed(destroyRef)
          )
          .subscribe();
      },

      // clear
      clearUserCollections() {
        patchState(store, { userCollections: [] });
      },

      // API fetch (ekvivalent tvog starog servisa)
      loadUserCollections: reload,

      addUserCollection(collectionId: number) {
        userCollectionService
          .createUserCollection(collectionId)
          .pipe(
            take(1),
            tap(() => {
              reload();
            }),
            catchError((error) => {
              console.error('Greska pri dodavanju kolekcije:', error);
              return of(null);
            }),
            takeUntilDestroyed(destroyRef)
          )
          .subscribe();
      },
    };
  })
);
