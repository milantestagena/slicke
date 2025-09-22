import { CommonModule } from '@angular/common';
import { Component, computed, effect, input, output, signal } from '@angular/core';
import { CollectionItem } from '../../models';

@Component({
  selector: 'app-exchange-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './exchange-item.component.html',
  styleUrls: ['./exchange-item.component.scss'],
})
export class ExchangeItemComponent {
  readonly item = input.required<CollectionItem>();
  readonly selected = input<boolean>(false);
  private readonly selectedState = signal(false);

  readonly isSelected = computed(() => this.selectedState());
  readonly selectionChange = output<{ item: CollectionItem; selected: boolean }>();

  constructor() {
    effect(() => {
      this.selectedState.set(this.selected());
    });
  }

  onToggleSelection() {
    const nextSelected = !this.selectedState();
    this.selectedState.set(nextSelected);
    this.selectionChange.emit({ item: this.item(), selected: nextSelected });
  }

  onImgError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'images/noimage.png';
  }
}
