import { CommonModule } from '@angular/common';
import { Component, computed, effect, input, output, signal } from '@angular/core';
import { UserCollectionItem } from '../../models';

@Component({
  selector: 'app-user-collection-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-collection-item.component.html',
  styleUrls: ['./user-collection-item.component.scss'],
})
export class UserCollectionItemComponent {
  readonly item = input.required<UserCollectionItem>();

  private readonly counter = signal(0);
  readonly colorClass = computed(() => {
    const value = this.counter();
    if (value === 0) {
      return 'red';
    }
    if (value === 1) {
      return 'green';
    }
    return 'blue';
  });

  readonly counterChanged = output<{ id: number; counter: number }>();

  constructor() {
    effect(() => {
      this.counter.set(this.item().counter);
    });
  }

  increment() {
    const next = this.counter() + 1;
    this.counter.set(next);
    this.counterChanged.emit({ id: this.item().id, counter: next });
  }

  decrement() {
    const current = this.counter();
    if (current <= 0) {
      return;
    }

    const next = current - 1;
    this.counter.set(next);
    this.counterChanged.emit({ id: this.item().id, counter: next });
  }

  onImgError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'images/noimage.png';
  }

  get counterValue(): number {
    return this.counter();
  }
}
