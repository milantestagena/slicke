import { signalStore } from '@ngrx/signals';
import { UserFeature, CountryFeature, MembershipFeature, ConversationsFeature, ConversationWithUserFeature } from './features';
import { AvailableCollectionsFeature } from './features/available-collections.feature';
import { UserCollectionsFeature, PublicCollectionsFeature, MatchesFeature } from './features';


export const AppStore = signalStore(
  { providedIn: 'root' }, // Makes store injectable
  UserFeature, // Add user feature
  CountryFeature,
  MembershipFeature,
  AvailableCollectionsFeature,
  UserCollectionsFeature,
  ConversationsFeature,
  ConversationWithUserFeature,
  PublicCollectionsFeature,
  MatchesFeature
);
