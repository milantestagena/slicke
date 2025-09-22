import { inject, Injectable } from '@angular/core';
import { Collection, CollectionPayload } from '../models/collection.model';
import { HTTPService } from './http.service';
import { GetUrls } from '../enums';

@Injectable({ providedIn: 'root' })
export class CollectionService {
  httpService: HTTPService;
  constructor() {
    this.httpService = inject(HTTPService);
  }

  getAllCollections() {
    return this.httpService.getRequestWithAuth(GetUrls.GET_COLLECTIONS);
  }

  getAvailableCollections() {
    return this.httpService.getRequestWithAuth(GetUrls.GET_AVAILABLE_COLLECTION);
  }

  deleteCollection(id: number) {
    return this.httpService.deleteRequestWithAuth(`${GetUrls.GET_COLLECTIONS}/${id}`);
  }

  saveCollection(collection: Collection | CollectionPayload) {
    if (collection.id) {
      return this.httpService.putRequestWithAuth(
        `collections/${collection.id}`,
        collection
      );
    } else {
      return this.httpService.postRequestWithAuth('collections', collection);
    }
  }
}
