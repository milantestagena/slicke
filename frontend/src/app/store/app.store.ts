import { signalStore, withComputed, withMethods } from '@ngrx/signals';
import {
  UserFeature,
  CountryFeature,
  MembershipFeature,
  ConversationsFeature,
  ConversationWithUserFeature,
} from './features';
import { AvailableCollectionsFeature } from './features/available-collections.feature';
import {
  UserCollectionsFeature,
  PublicCollectionsFeature,
  MatchesFeature,
} from './features';
import { CollectionsFeature } from './features/collections.feature';
import { computed } from '@angular/core';
import { ProposalsFeature } from './features/proposals.feature';

export const AppStore = signalStore(
  { providedIn: 'root' }, // Makes store injectable
  UserFeature,
  CountryFeature,
  MembershipFeature,
  AvailableCollectionsFeature,
  UserCollectionsFeature,
  ConversationsFeature,
  ConversationWithUserFeature,
  PublicCollectionsFeature,
  MatchesFeature,
  CollectionsFeature,
  ProposalsFeature,
  withComputed(({ userCollections, availableCollections }) => ({
    availableNotOwned: computed(() => {
      const owned = new Set(userCollections().map((c) => c.collection.id));
      return availableCollections().filter((c) => !owned.has(c.id as number));
    }),
  })),
  withMethods((store) => {
    const resetStore = () => {
      store.resetAvailableCollections();
      store.resetCollections();
      store.resetConversationWithUser();
      store.resetConversations();
      store.resetCountries();
      store.resetMatches();
      store.resetMembership();
      store.resetProposals();
      store.resetPublicCollections();
      store.resetUser();
      store.resetUserCollections();
    };

    return {
      resetStore,
      logout() {
        resetStore();
      },
    };
  })
);
