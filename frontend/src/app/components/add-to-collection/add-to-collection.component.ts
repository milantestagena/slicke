import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppStore } from '../../store/app.store';

@Component({
  selector: 'app-add-to-collection',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './add-to-collection.component.html',
  styleUrls: ['./add-to-collection.component.scss'],
})
export class AddToCollectionComponent {
  private readonly store = inject(AppStore);

  readonly availableCollections = this.store.availableNotOwned;
  readonly selectedCollectionId = signal<number | null>(null);

  onCollectionChange(event: Event) {
    const value = (event.target as HTMLSelectElement | null)?.value ?? '';
    const parsed = value ? Number(value) : null;
    this.selectedCollectionId.set(
      parsed !== null && Number.isFinite(parsed) ? parsed : null
    );
  }

  submit() {
    const collectionId = this.selectedCollectionId();
    if (!collectionId) {
      return;
    }

    this.store.addUserCollection(collectionId);
  }
}
