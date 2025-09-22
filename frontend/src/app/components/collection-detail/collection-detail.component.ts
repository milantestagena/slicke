import {
  Component,
  Input,
  WritableSignal,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserCollection } from '../../models';
import { UserCollectionItemComponent } from '../user-collection-item/user-collection-item.component';
import { UserCollectionService } from '../../services/user-collection.service';
import { NotificationService } from '../../services/notification.service';
import { AppStore } from '../../store/app.store';

@Component({
  selector: 'app-collection-detail',
  standalone: true,
  imports: [CommonModule, UserCollectionItemComponent],
  templateUrl: './collection-detail.component.html',
  styleUrls: ['./collection-detail.component.scss'],
})
export class CollectionDetailComponent {
  private _collection: UserCollection | null = null;
  store = inject(AppStore);

  @Input() set collection(value: UserCollection | null) {
    this._collection = value;
    this.resetCounters();
  }

  get collection(): UserCollection | null {
    return this._collection;
  }

  private readonly collectionService = inject(UserCollectionService);
  private readonly notificationService = inject(NotificationService);

  readonly currentCounters: WritableSignal<Record<number, number>> = signal({});
  readonly originalCounters = signal<Record<number, number>>({});

  private resetCounters(): void {
    const collection = this.collection;
    if (!collection?.items?.length) {
      this.originalCounters.set({});
      this.currentCounters.set({});
      return;
    }

    const snapshot: Record<number, number> = {};
    collection.items.forEach((item) => {
      snapshot[item.id] = item.counter;
    });

    this.originalCounters.set(snapshot);
    this.currentCounters.set({ ...snapshot });
  }

  onCounterChanged(change: { id: number; counter: number }) {
    this.currentCounters.update((current) => ({
      ...current,
      [change.id]: change.counter,
    }));
  }

  readonly hasChanges = computed(() => {
    const current = this.currentCounters();
    const original = this.originalCounters();

    return Object.entries(current).some(([id, counter]) => {
      const numericId = Number(id);
      return counter !== original[numericId];
    });
  });

  private getChangedItems(): Record<number, number> {
    const current = this.currentCounters();
    const original = this.originalCounters();
    const changes: Record<number, number> = {};

    for (const [id, counter] of Object.entries(current)) {
      const numericId = Number(id);
      if (counter !== original[numericId]) {
        changes[numericId] = counter;
      }
    }

    return changes;
  }

  submitUpdate() {
    const payload = this.getChangedItems();
    if (!Object.keys(payload).length || !this.collection) {
      return;
    }

    this.store.updateUserCollection(this.collection.id, { items: payload });
    this.originalCounters.set({ ...this.currentCounters() });
  }
}
