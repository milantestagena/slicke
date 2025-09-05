// collection-sidebar.component.ts
import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppStore } from '../../../store/app.store';
import { Collection } from '../../../models';

@Component({
  selector: 'app-admin-collections-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-collections-sidebar.component.html',
  styleUrls: ['./admin-collections-sidebar.component.scss'],
})
export class AdminCollectionsSidebarComponent implements OnInit {
  private store = inject(AppStore);
  collections = this.store.collections;

  @Output() collectionSelected = new EventEmitter<Collection>();
  @Output() addCollectionRequested = new EventEmitter<void>();

  ngOnInit() {
    console.log('Collections loaded:', this.collections);
  }

  selectCollection(collection: Collection) {
    this.collectionSelected.emit(collection);
  }

  addNew() {
    this.addCollectionRequested.emit();
  }

  get collectionsArray() {
    return this.collections(); // Call the signal to get the array
  }
}
