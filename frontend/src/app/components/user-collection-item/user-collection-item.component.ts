import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserCollectionItem } from '../../models';

@Component({
  selector: 'app-user-collection-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-collection-item.component.html',
  styleUrls: ['./user-collection-item.component.scss'],
})
export class UserCollectionItemComponent {
  @Input() item!: UserCollectionItem;

  @Output() counterChanged = new EventEmitter<{
    id: number;
    counter: number;
  }>();

  get colorClass(): string {
    if (this.item.counter === 0) return 'red';
    if (this.item.counter === 1) return 'green';
    return 'blue';
  }

  increment() {
    this.item.counter++;
    this.counterChanged.emit({
      id: this.item.id,
      counter: this.item.counter,
    });
  }

  decrement() {
    if (this.item.counter > 0) {
      this.item.counter--;
      this.counterChanged.emit({
        id: this.item.id,
        counter: this.item.counter,
      });
    }
  }

  onImgError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'images/noimage.png'; // Fallback image
  }
}
