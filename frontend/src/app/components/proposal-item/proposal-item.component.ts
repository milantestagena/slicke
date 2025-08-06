import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-proposal-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './proposal-item.component.html',
  styleUrls: ['./proposal-item.component.scss'],
})
export class ProposalItemComponent {
  @Input() identifier!: string;
  @Input() link!: string;

  onImgError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = 'images/noimage.png';
  }

}
