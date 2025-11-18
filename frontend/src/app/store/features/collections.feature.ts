import {
  signalStoreFeature,
  withState,
  withMethods,
  withHooks,
  withComputed,
  patchState,
} from '@ngrx/signals';
import { inject, DestroyRef, computed } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Collection, CollectionPayload } from '../../models';
import { CollectionService } from '../../services/collection.service';
import { NotificationService } from '../../services/notification.service';
import { catchError, finalize, map, of, take, tap } from 'rxjs';

interface CollectionsState {
  collections: Collection[];
  collectionsLoading: boolean;
  collectionsError: string | null;
}

const defaultCollectionsState = (): CollectionsState => ({
  collections: [],
  collectionsLoading: false,
  collectionsError: null,
});

let collectionService: CollectionService;
let notificationService: NotificationService;
let destroyRef: DestroyRef;

export const CollectionsFeature = signalStoreFeature(
  withState<CollectionsState>(defaultCollectionsState()),

  withHooks(() => ({
    onInit() {
      collectionService = inject(CollectionService);
      notificationService = inject(NotificationService);
      destroyRef = inject(DestroyRef);
    },
  })),

  withComputed((store) => ({
    hasCollections: computed(() => store.collections().length > 0),
  })),

  withMethods((store) => {
    const resetState = () => patchState(store, defaultCollectionsState());
    const reloadAll = () => {
      patchState(store, {
        collectionsLoading: true,
        collectionsError: null,
      });
      collectionService
        .getAllCollections()
        .pipe(
          take(1),
          map((r: { data: Collection[] }) => r?.data ?? []),
          catchError(() => {
            patchState(store, { collectionsError: 'loadAll failed' });
            return of<Collection[]>([]);
          }),
          finalize(() =>
            patchState(store, { collectionsLoading: false })
          ),
          takeUntilDestroyed(destroyRef)
        )
        .subscribe((list) => {
          patchState(store, { collections: list });
        });
    };

    return {
      setCollections(collections: Collection[]) {
        patchState(store, { collections });
      },

      getCollections() {
        return [...store.collections()];
      },


      loadAllCollections: reloadAll,

      saveCollection(collection: Collection | CollectionPayload) {
        collectionService
          .saveCollection(collection)
          .pipe(
            tap(() => {
              reloadAll();
              notificationService.show('success', 'Collection saved.');
            }),
            catchError(() => {
              notificationService.show('error', 'Could not save collection.');
              return of(null);
            }),
            takeUntilDestroyed(destroyRef)
          )
          .subscribe();
      },

      deleteCollection(id: number) {
        collectionService
          .deleteCollection(id)
          .pipe(
            tap(() => reloadAll()),
            catchError(() => of(null)),
            takeUntilDestroyed(destroyRef)
          )
          .subscribe();
      },

      resetCollections: resetState,
    };
  })
);
