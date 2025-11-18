import {
  signalStoreFeature,
  withState,
  withMethods,
  withHooks,
  patchState,
} from '@ngrx/signals';
import { inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Proposal } from '../../models/proposal.model';
import { ProposalService } from '../../services/proposal.service';
import { catchError, finalize, map, of, take, tap } from 'rxjs';

export interface ProposalsState {
  proposals: Proposal[];
  proposalsLoading: boolean;
  proposalsError: string | null;
}

const defaultProposalsState = (): ProposalsState => ({
  proposals: [],
  proposalsLoading: false,
  proposalsError: null,
});

let proposalsService: ProposalService;
let destroyRef: DestroyRef;

export const ProposalsFeature = signalStoreFeature(
  withState<ProposalsState>(defaultProposalsState()),

  withHooks(() => ({
    onInit() {
      proposalsService = inject(ProposalService);
      destroyRef = inject(DestroyRef);
    },
  })),

  withMethods((store) => {
    const resetState = () => patchState(store, defaultProposalsState());
    const reload = (collectionId: number) => {
      patchState(store, {
        proposalsLoading: true,
        proposalsError: null,
      });
      proposalsService
        .getProposals(collectionId)
        .pipe(
          take(1),
          map((r: any) => r?.data ?? []),
          catchError(() => {
            patchState(store, {
              proposalsError: 'Failed to load proposals',
            });
            return of<Proposal[]>([]);
          }),
          finalize(() =>
            patchState(store, { proposalsLoading: false })
          ),
          takeUntilDestroyed(destroyRef)
        )
        .subscribe((list) => patchState(store, { proposals: list }));
    };

    return {
      loadProposals(collectionId: number) {
        reload(collectionId);
      },

      clearProposals() {
        resetState();
      },

      getProposalCopy() {
        return [...store.proposals()];
      },

      acceptProposal(proposalId: number, collectionIdToReload: number) {
        proposalsService
          .acceptProposal(proposalId)
          .pipe(
            take(1),
            tap(() => reload(collectionIdToReload)),
            catchError(() => of(null)),
            takeUntilDestroyed(destroyRef)
          )
          .subscribe();
      },

      refuseProposal(proposalId: number, collectionIdToReload: number) {
        proposalsService
          .refuseProposal(proposalId)
          .pipe(
            take(1),
            tap(() => reload(collectionIdToReload)),
            catchError(() => of(null)),
            takeUntilDestroyed(destroyRef)
          )
          .subscribe();
      },

      createProposal(payload: {
        collection_id: number;
        receiver_id: number;
        offer: number[];
        need: number[];
      }) {
        proposalsService
          .createProposal(payload as any)
          .pipe(
            take(1),
            tap(() => {
              reload(payload.collection_id);
            }),
            catchError(() => of(null)),
            takeUntilDestroyed(destroyRef)
          )
          .subscribe();
      },

      resetProposals: resetState,
    };
  })
);
