import { inject, Injectable } from '@angular/core';
import { Collection } from '../models/collection.model';
import { HTTPService } from './http.service';

@Injectable({ providedIn: 'root' })
export class CollectionService {
  httpService: HTTPService;
  constructor() {
    this.httpService = inject(HTTPService);
  }

  getAllCollections() {
    return this.httpService.getRequestWithAuth('collections');
  }

  deleteCollection(id: number) {
    return this.httpService.deleteRequestWithAuth(`collections/${id}`);
  }

  saveCollection(collection: Collection) {
    if (collection.id) {
      return this.httpService
        .putRequestWithAuth(`collections/${collection.id}`, collection);
    } else {
      return this.httpService
        .postRequestWithAuth('collections', collection);
    }
  }
}
