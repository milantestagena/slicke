import {
  signalStoreFeature,
  withState,
  withMethods,
  patchState,
  withHooks,
} from '@ngrx/signals';
import { Collection } from '../../models';
import { CollectionService } from '../../services/collection.service';
import { DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { take, map, catchError, of, finalize } from 'rxjs';

type AvailableCollectionsState = {
  availableCollections: Collection[];
  availableCollectionsLoading: boolean;
  availableCollectionsError: string | null;
};

const defaultAvailableCollectionsState = (): AvailableCollectionsState => ({
  availableCollections: [],
  availableCollectionsLoading: false,
  availableCollectionsError: null,
});

let collectionService: CollectionService;
let destroyRef: DestroyRef;
export const AvailableCollectionsFeature = signalStoreFeature(
  withState<AvailableCollectionsState>(defaultAvailableCollectionsState()),
  withHooks(() => ({
    onInit() {
      collectionService = inject(CollectionService);
      destroyRef = inject(DestroyRef);
    },
  })),
  withMethods((store) => {
    const resetState = () =>
      patchState(store, defaultAvailableCollectionsState());

    return {
      setAvailableCollections: (AvailableCollections: any) =>
        patchState(store, { availableCollections: AvailableCollections }),
      getAvailableCollections: () => [...store.availableCollections()],
      loadAvailableCollections() {
        patchState(store, {
          availableCollectionsLoading: true,
          availableCollectionsError: null,
        });
        collectionService
          .getAvailableCollections()
          .pipe(
            take(1),
            map((r: any) => r?.data ?? []),
            catchError(() => {
              patchState(store, {
                availableCollectionsError: 'loadAvailable failed',
              });
              return of<Collection[]>([]);
            }),
            finalize(() =>
              patchState(store, { availableCollectionsLoading: false })
            ),
            takeUntilDestroyed(destroyRef)
          )
          .subscribe((items) => {
            patchState(store, { availableCollections: items });
          });
      },
      resetAvailableCollections: resetState,
    };
  })
);
