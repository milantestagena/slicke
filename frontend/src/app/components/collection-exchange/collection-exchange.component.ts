import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppStore } from '../../store/app.store';
import {
  CollectionItem,
  UserCollection,
  UserCollectionItem,
} from '../../models';
import { ExchangeItemComponent } from '../exchange-item/exchange-item.component';
import { ProposalService } from '../../services/proposal.service';

@Component({
  selector: 'app-collection-exchange',
  standalone: true,
  imports: [CommonModule, ExchangeItemComponent],
  templateUrl: './collection-exchange.component.html',
  styleUrl: './collection-exchange.component.scss',
})
export class CollectionExchangeComponent implements OnChanges {
  @Input({ required: true }) collection!: UserCollection;

  private readonly store = inject(AppStore);
  private readonly proposalService = inject(ProposalService);
  readonly exchangeData = this.store.exchangeData;

  readonly selectedToGiveIds = signal(new Set<number>());
  readonly selectedToTakeIds = signal(new Set<number>());
  private itemMap = new Map<string, UserCollectionItem>();

  ngOnChanges(changes: SimpleChanges): void {
    if ('collection' in changes && this.collection) {
      this.store.loadExchangeForCollection(this.collection.id);
      this.itemMap = new Map(
        this.collection.items.map((i) => [i.item.id.toString(), i]),
      );
      this.selectedToGiveIds.set(new Set());
      this.selectedToTakeIds.set(new Set());
    }
  }

  getToGiveItems(): UserCollectionItem[] {
    const data = this.exchangeData();
    if (!data) {
      return [];
    }

    return data.toGiveIds
      .map((id: number) => this.itemMap.get(id.toString()) ?? null)
      .filter((item): item is UserCollectionItem => item !== null);
  }

  getToTakeItems(): UserCollectionItem[] {
    const data = this.exchangeData();
    if (!data) {
      return [];
    }

    return data.toTakeIds
      .map((id: number) => this.itemMap.get(id.toString()) ?? null)
      .filter((item): item is UserCollectionItem => item !== null);
  }

  isSelectedToGive(item: CollectionItem): boolean {
    return this.selectedToGiveIds().has(item.id);
  }

  isSelectedToTake(item: CollectionItem): boolean {
    return this.selectedToTakeIds().has(item.id);
  }

  onToggleToGive(event: { item: CollectionItem; selected: boolean }) {
    const nextSet = new Set(this.selectedToGiveIds());
    event.selected ? nextSet.add(event.item.id) : nextSet.delete(event.item.id);
    this.selectedToGiveIds.set(nextSet);
  }

  onToggleToTake(event: { item: CollectionItem; selected: boolean }) {
    const nextSet = new Set(this.selectedToTakeIds());
    event.selected ? nextSet.add(event.item.id) : nextSet.delete(event.item.id);
    this.selectedToTakeIds.set(nextSet);
  }

  submitExchange() {
    const data = this.exchangeData();
    if (!data) {
      return;
    }

    const payload = {
      receiver_id: Number(data.otherUserId),
      collection_id: Number(data.collectionId),
      offer: Array.from(this.selectedToGiveIds()),
      need: Array.from(this.selectedToTakeIds()),
    };

    this.selectedToGiveIds.set(new Set());
    this.selectedToTakeIds.set(new Set());
    this.proposalService.createProposal(payload);
  }
}
