import { inject, Injector } from '@angular/core';
import {
  signalStoreFeature,
  withState,
  withMethods,
  withHooks,
  patchState,
} from '@ngrx/signals';
import { Proposal } from '../../models/proposal.model';
import { ProposalService } from '../../services/proposal.service';

export interface ProposalsState {
  proposals: Proposal[];
  loading: boolean;
  error: string | null;
}

let proposalsService: ProposalService;

export const ProposalsFeature = signalStoreFeature(
  withState<ProposalsState>({
    proposals: [],
    loading: false,
    error: null,
  }),

  withHooks(() => ({
    onInit() {
      const injector = inject(Injector);
      proposalsService = inject(ProposalService);
    },
  })),

  withMethods((store) => ({
    loadProposals: (collectionId: number) => {
      patchState(store, {
        loading: true,
        error: null,
      });

      proposalsService.getProposals(collectionId).subscribe({
        next: (proposals) =>
          patchState(store, {
            proposals,
            loading: false,
          }),
        error: (err) =>
          patchState(store, {
            error: err.message || 'Failed to load proposals',
            loading: false,
          }),
      });
    },

    clearProposals: () =>
      patchState(store, {
        proposals: [],
        loading: false,
        error: null,
      }),

    getProposalCopy: () => [...store.proposals()],
  }))
);
