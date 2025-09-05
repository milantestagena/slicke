import { Component, inject, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Collection, UserCollection } from '../../models';
import { AppStore } from '../../store/app.store';
import { UserCollectionService } from '../../services/user-collection.service';
import { tap, catchError, of, finalize } from 'rxjs';
import { StoreService } from '../../services/store.service';

@Component({
  selector: 'app-add-to-collection',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './add-to-collection.component.html',
  styleUrls: ['./add-to-collection.component.scss'],
})
export class AddToCollectionComponent {
  storeService = inject(StoreService);
  collectionService = inject(UserCollectionService);
  store = inject(AppStore);
  userCollections: UserCollection[];
  availableCollections: Collection[];
  selectedCollectionId = signal<number | null>(null);

  constructor() {
    this.userCollections = this.store.userCollections();
    const userCollectionIds = this.userCollections.map((c) => c.collection.id);
    this.availableCollections = this.store.AvailableCollections().filter(
      (collection) => {
        return !userCollectionIds.includes(collection.id)
      }
    );
  }

  submit() {
    const collectionId = this.selectedCollectionId();
    if (collectionId) {
      this.collectionService
        .createUserCollection(collectionId)
        .pipe(
          tap((response) => {
            this.storeService.getUserCollections();
          }),
          catchError((error) => {
            console.error('Greška pri dodavanju kolekcije:', error);
            return of(null);
          }),
          finalize(() => {
            // Eventualni loading indikator ukloni
          })
        )
        .subscribe();
    }
  }
}
