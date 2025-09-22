import { Component, EventEmitter, inject, OnInit, Output, Signal } from '@angular/core';
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
export class CollectionsSidebarComponent implements OnInit {
  store = inject(AppStore);

  openedExchange: any = null;

  @Output() collectionSelected = new EventEmitter<UserCollection>();
  @Output() addCollectionRequested = new EventEmitter<void>();
  @Output() exchangeSelected = new EventEmitter<UserCollection>();
  @Output() proposalsSelected = new EventEmitter<UserCollection>();

  public collections!: Signal<UserCollection[]>;

  ngOnInit(): void {
    this.store.loadUserCollections();
    this.collections = this.store.userCollections;
  }

  select(collection: UserCollection) {
    this.store.loadUserCollections();
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
