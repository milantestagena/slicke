import { Component, Input, OnInit, inject, signal, effect, untracked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppStore } from '../../store/app.store';
import {
  CollectionItem,
  UserCollection,
  UserCollectionItem,
} from '../../models';
import { ExchangeItemComponent } from '../exchange-item/exchange-item.component';
import { ExchangeData } from '../../models/exchange-data';

@Component({
  selector: 'app-collection-exchange',
  standalone: true,
  imports: [CommonModule, ExchangeItemComponent],
  templateUrl: './collection-exchange.component.html',
  styleUrl: './collection-exchange.component.scss',
})
export class CollectionExchangeComponent implements OnInit {
  @Input({ required: true }) collection!: UserCollection;

  private readonly store = inject(AppStore);
  readonly exchangeData = this.store.exchangeData;

  readonly toGiveItems = signal<UserCollectionItem[][]>([]);
  readonly toTakeItems = signal<UserCollectionItem[][]>([]);

  readonly selectedToGiveIds = signal<Set<number>[]>([]);
  readonly selectedToTakeIds = signal<Set<number>[]>([]);
  private readonly exchangeWatcher = effect(() => {
    const exchanges = this.exchangeData();
    const currentGive = untracked(() => this.selectedToGiveIds());
    const currentTake = untracked(() => this.selectedToTakeIds());
    this.rebuildExchangeArrays(exchanges, currentGive, currentTake);
  });
  private itemMap = new Map<string, UserCollectionItem>();

  ngOnInit() {
    this.store.loadExchangeForCollection(this.collection.id);
    this.itemMap = new Map(
      this.collection.items.map((i) => [i.item.id.toString(), i])
    );
    this.selectedToGiveIds.set([]);
    this.selectedToTakeIds.set([]);
    this.rebuildExchangeArrays(this.exchangeData(), [], []);
  }

  private rebuildExchangeArrays(
    data: ExchangeData[] | null | undefined,
    currentGive: Set<number>[] | null,
    currentTake: Set<number>[] | null
  ) {
    if (!data?.length || this.itemMap.size === 0) {
      this.toGiveItems.set([]);
      this.toTakeItems.set([]);
      this.selectedToGiveIds.set([]);
      this.selectedToTakeIds.set([]);
      return;
    }

    const toGive = data.map((exchange) =>
      exchange.toGiveIds
        .map((id) => this.itemMap.get(id.toString()) ?? null)
        .filter((item): item is UserCollectionItem => item !== null)
    );

    const toTake = data.map((exchange) =>
      exchange.toTakeIds
        .map((id) => this.itemMap.get(id.toString()) ?? null)
        .filter((item): item is UserCollectionItem => item !== null)
    );

    this.toGiveItems.set(toGive);
    this.toTakeItems.set(toTake);

    const existingGive = currentGive ?? [];
    const existingTake = currentTake ?? [];

    const nextGiveSelections = data.map((exchange, index) => {
      const existing = existingGive[index] ?? new Set<number>();
      const validIds = new Set(exchange.toGiveIds);
      return new Set(Array.from(existing).filter((id) => validIds.has(id)));
    });

    const nextTakeSelections = data.map((exchange, index) => {
      const existing = existingTake[index] ?? new Set<number>();
      const validIds = new Set(exchange.toTakeIds);
      return new Set(Array.from(existing).filter((id) => validIds.has(id)));
    });

    this.selectedToGiveIds.set(nextGiveSelections);
    this.selectedToTakeIds.set(nextTakeSelections);
  }

  isSelectedToGive(exchangeIndex: number, item: CollectionItem): boolean {
    const sets = this.selectedToGiveIds();
    return sets[exchangeIndex]?.has(item.id) ?? false;
  }

  isSelectedToTake(exchangeIndex: number, item: CollectionItem): boolean {
    const sets = this.selectedToTakeIds();
    return sets[exchangeIndex]?.has(item.id) ?? false;
  }

  onToggleToGive(
    exchangeIndex: number,
    event: { item: CollectionItem; selected: boolean }
  ) {
    const nextSets = [...this.selectedToGiveIds()];
    while (nextSets.length <= exchangeIndex) {
      nextSets.push(new Set<number>());
    }
    const targetSet = new Set(nextSets[exchangeIndex]);
    if (event.selected) {
      targetSet.add(event.item.id);
    } else {
      targetSet.delete(event.item.id);
    }
    nextSets[exchangeIndex] = targetSet;
    this.selectedToGiveIds.set(nextSets);
  }

  onToggleToTake(
    exchangeIndex: number,
    event: { item: CollectionItem; selected: boolean }
  ) {
    const nextSets = [...this.selectedToTakeIds()];
    while (nextSets.length <= exchangeIndex) {
      nextSets.push(new Set<number>());
    }
    const targetSet = new Set(nextSets[exchangeIndex]);
    if (event.selected) {
      targetSet.add(event.item.id);
    } else {
      targetSet.delete(event.item.id);
    }
    nextSets[exchangeIndex] = targetSet;
    this.selectedToTakeIds.set(nextSets);
  }

  submitExchange(exchangeIndex: number, data: ExchangeData) {
    if (!data) {
      return;
    }

    const giveSelections = this.selectedToGiveIds()[exchangeIndex] ?? new Set<number>();
    const takeSelections = this.selectedToTakeIds()[exchangeIndex] ?? new Set<number>();

    const payload = {
      receiver_id: Number(data.otherUserId),
      collection_id: Number(data.collectionId),
      offer: Array.from(giveSelections),
      need: Array.from(takeSelections),
    };

    const nextGiveSets = [...this.selectedToGiveIds()];
    nextGiveSets[exchangeIndex] = new Set<number>();
    this.selectedToGiveIds.set(nextGiveSets);

    const nextTakeSets = [...this.selectedToTakeIds()];
    nextTakeSets[exchangeIndex] = new Set<number>();
    this.selectedToTakeIds.set(nextTakeSets);

    this.store.createProposal(payload);
  }
}
