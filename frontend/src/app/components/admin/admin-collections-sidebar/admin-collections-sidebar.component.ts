import { Component, EventEmitter, Output, inject } from '@angular/core';
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
export class AdminCollectionsSidebarComponent {
  private readonly store = inject(AppStore);

  readonly collections = this.store.collections;

  @Output() collectionSelected = new EventEmitter<Collection>();
  @Output() addCollectionRequested = new EventEmitter<void>();

  selectCollection(collection: Collection) {
    this.collectionSelected.emit(collection);
  }

  addNew() {
    this.addCollectionRequested.emit();
  }

  onDelete(col: Collection, ev: MouseEvent) {
    ev.stopPropagation();
    if (!confirm(`Delete "${col.name}"?`)) {
      return;
    }

    this.store.deleteCollection(col.id as number);
  }
}
