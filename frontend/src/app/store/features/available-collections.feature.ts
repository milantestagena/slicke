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
  loading: boolean;
  error: string | null;
};

const defaultAvailableCollectionsState = (): AvailableCollectionsState => ({
  availableCollections: [],
  loading: false,
  error: null,
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
        patchState(store, { loading: true, error: null });
        collectionService
          .getAvailableCollections()
          .pipe(
            take(1),
            map((r: any) => r?.data ?? []),
            catchError(() => {
              patchState(store, { error: 'loadAvailable failed' });
              return of<Collection[]>([]);
            }),
            finalize(() => patchState(store, { loading: false })),
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
