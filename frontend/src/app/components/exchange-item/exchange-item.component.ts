import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CollectionItem } from "../../models";
import { CommonModule } from "@angular/common";

@Component({
  selector: 'app-exchange-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './exchange-item.component.html',
  styleUrls: ['./exchange-item.component.scss'],
})
export class ExchangeItemComponent {
  @Input() item!: CollectionItem;
  @Input() selected = false;
  @Output() selectionChange = new EventEmitter<{ item: CollectionItem; selected: boolean }>();

  onToggleSelection() {
    this.selected = !this.selected;
    this.selectionChange.emit({ item: this.item, selected: this.selected });
  }

  onImgError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'images/noimage.png'; // Fallback image
  }
}
