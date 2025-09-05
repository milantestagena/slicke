import {
  Component,
  Input,
  signal,
  computed,
  effect,
  WritableSignal,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserCollection } from '../../models';
import { UserCollectionItemComponent } from '../user-collection-item/user-collection-item.component';
import { UserCollectionService } from '../../services/user-collection.service';
import { NotificationService } from '../../services/notification.service';
@Component({
  selector: 'app-collection-detail',
  standalone: true,
  imports: [CommonModule, UserCollectionItemComponent],
  templateUrl: './collection-detail.component.html',
  styleUrls: ['./collection-detail.component.scss'],
})
export class CollectionDetailComponent {
  @Input() collection!: UserCollection;

  collectionService = inject(UserCollectionService);
  notificationService = inject(NotificationService);

  currentCounters: WritableSignal<Record<number, number>> = signal({});
  originalCounters: Record<number, number> = {};

  ngOnInit() {
    // zabeleži originalne vrednosti
    const snapshot: Record<number, number> = {};
    this.collection.items.forEach((item) => {
      snapshot[item.item.id] = item.counter;
    });

    this.originalCounters = snapshot;
    this.currentCounters.set({ ...snapshot });
  }

  onCounterChanged(change: { id: number; counter: number }) {
    const updated = { ...this.currentCounters() };
    updated[change.id] = change.counter;
    this.currentCounters.set(updated);
  }

  hasChanges = computed(() => {
    const current = this.currentCounters();
    for (const id in current) {
      if (current[id] !== this.originalCounters[+id]) {
        return true;
      }
    }
    return false;
  });

  getChangedItems(): Record<number, number> {
    const current = this.currentCounters();
    const result: Record<number, number> = {};
    for (const id in current) {
      const original = this.originalCounters[+id];
      if (current[id] !== original) {
        result[+id] = current[id];
      }
    }
    return result;
  }

  submitUpdate() {
    const payload = this.getChangedItems();
    this.collectionService
      .updateUserCollection(this.collection.id, { items: payload })
      .subscribe({
        next: () => {
          this.notificationService.show(
            'success',
            'Collection updated successfully'
          );
        },
        error: (err) => {
          this.notificationService.show('error', 'Collection update failed');
        },
      });
  }
}
