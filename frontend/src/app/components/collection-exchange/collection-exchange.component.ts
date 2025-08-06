import { Component, Input, inject, signal } from '@angular/core';
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
export class CollectionExchangeComponent {
  @Input() collection!: UserCollection;

  private store = inject(AppStore);
  private proposalService = inject(ProposalService);
  exchangeData = this.store.exchangeData;

  selectedToGiveIds = new Set<number>();
  selectedToTakeIds = new Set<number>();
  itemMap = new Map<string, UserCollectionItem>();

  ngOnInit() {
    this.store.loadExchangeForCollection(this.collection.id);
    this.itemMap = new Map(
      this.collection.items.map((i) => [i.item.id.toString(), i])
    );
  }

  getToGiveItems(): UserCollectionItem[] {
    if (!this.exchangeData()) return [];
    const mapped = this.exchangeData()?.toGiveIds.map((id: number) => {
      const item = this.itemMap.get(id.toString());
      return item;
    });
    console.log(this.exchangeData());
    return mapped as UserCollectionItem[];
  }

  getToTakeItems(): UserCollectionItem[] {
    if (!this.exchangeData()) return [];
    return this.exchangeData()
      ?.toTakeIds.map((id: number) => this.itemMap.get(id.toString()))
      .filter((i): i is UserCollectionItem => !!i) as UserCollectionItem[];
  }

  isSelectedToGive(item: CollectionItem): boolean {
    return this.selectedToGiveIds.has(item.id);
  }

  isSelectedToTake(item: CollectionItem): boolean {
    return this.selectedToTakeIds.has(item.id);
  }

  onToggleToGive(event: { item: CollectionItem; selected: boolean }) {
    event.selected
      ? this.selectedToGiveIds.add(event.item.id)
      : this.selectedToGiveIds.delete(event.item.id);
  }

  onToggleToTake(event: { item: CollectionItem; selected: boolean }) {
    event.selected
      ? this.selectedToTakeIds.add(event.item.id)
      : this.selectedToTakeIds.delete(event.item.id);
  }

  submitExchange() {
    const payload = {
      receiver_id: Number(this.exchangeData()?.otherUserId),
      collection_id: Number(this.exchangeData()?.collectionId),
      offer: Array.from(this.selectedToGiveIds),
      need: Array.from(this.selectedToTakeIds),
    };
    this.selectedToGiveIds.clear();
    this.selectedToTakeIds.clear();
    this.proposalService.createProposal(payload);
  }
}
