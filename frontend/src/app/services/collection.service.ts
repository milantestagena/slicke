import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Collection } from '../models/collection.model';

@Injectable({ providedIn: 'root' })
export class CollectionService {
  constructor(private http: HttpClient) {}

  getAllCollections() {
    return this.http.get<Collection[]>('/api/collections').toPromise();
  }
}
