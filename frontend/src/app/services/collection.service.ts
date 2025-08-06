import { Injectable, inject } from '@angular/core';
import { HTTPService } from './http.service';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root',
})
export class CollectionService {
  private http = inject(HTTPService);
  private notification = inject(NotificationService);

  getAllAvailableCollections() {
    return this.http.getRequest('available_collections');
  }

  getUserCollections() {
    return this.http.getRequestWithAuth('user_collections');
  }

  getUserCollectionById(id: number | string) {
    return this.http.getRequestWithAuth(`user_collection/${id}`);
  }

  updateUserCollection(id: number | string, data: any) {
    return this.http.putRequestWithAuth(`user_collection/${id}`, data);
  }

  createUserCollection(id: number) {
    return this.http.postRequestWithAuth(`user_collection/${id}`, null);
  }

  updateCollectionWithFeedback(id: number | string, data: any) {
    this.updateUserCollection(id, data).subscribe({
      next: () => {
        this.notification.show('success', 'Collection updated successfully');
      },
      error: (err) => {
        this.notification.show('error', 'Failed to update collection');
        console.error(err);
      },
    });
  }
}
