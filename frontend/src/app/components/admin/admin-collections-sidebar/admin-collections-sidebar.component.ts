// collection-sidebar.component.ts
import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppStore } from '../../../store/app.store';
import { Collection } from '../../../models';
import { StoreService } from '../../../services/store.service';

@Component({
  selector: 'app-admin-collections-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-collections-sidebar.component.html',
  styleUrls: ['./admin-collections-sidebar.component.scss'],
})
export class AdminCollectionsSidebarComponent implements OnInit {
  private store = inject(AppStore);
  private storeService = inject(StoreService);
  collections = this.store.collections;

  @Output() collectionSelected = new EventEmitter<Collection>();
  @Output() addCollectionRequested = new EventEmitter<void>();

  ngOnInit() {
    //console.log('Collections loaded:', this.collections);
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

  onDelete(col: Collection, ev: MouseEvent) {
    ev.stopPropagation();
    if (!confirm(`Delete "${col.name}"?`)) return;
    this.storeService.deleteCollection(col.id as number);
  }
}
