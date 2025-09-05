import { UserCollectionItem } from './';
import { CollectionDetails } from './';

export interface UserCollection {
  id: number;
  collection: CollectionDetails;
  items: UserCollectionItem[];
}
