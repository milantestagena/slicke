import { Component, EventEmitter, inject, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserCollectionService } from '../../services/user-collection.service';
import { UserCollection } from '../../models';
import { AppStore } from '../../store/app.store';

@Component({
  selector: 'app-collections-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './collections-sidebar.component.html',
  styleUrls: ['./collections-sidebar.component.scss'],
})
export class CollectionsSidebarComponent {
  store = inject(AppStore);
  collections = this.store.userCollections;
  openedExchange: any = null;

  @Output() collectionSelected = new EventEmitter<UserCollection>();
  @Output() addCollectionRequested = new EventEmitter<void>();
  @Output() exchangeSelected = new EventEmitter<UserCollection>();
  @Output() proposalsSelected = new EventEmitter<UserCollection>();

  select(collection: UserCollection) {
    this.collectionSelected.emit(collection);
  }

  addToCollection() {
    this.addCollectionRequested.emit();
  }

  openedCollection: any = null;

  toggle(collection: UserCollection) {
    this.openedCollection =
      this.openedCollection === collection ? null : collection;
  }

  exchange(collection: UserCollection) {
    this.openedExchange =
      this.openedExchange === collection ? null : collection;
    this.exchangeSelected.emit(collection);
  }

  proposals(collection: UserCollection) {
    this.proposalsSelected.emit(collection);
  }
}
