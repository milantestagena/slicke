import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  effect,
  input,
  inject,
  signal,
} from '@angular/core';
import { Proposal } from '../../models/proposal.model';
import { AppStore } from '../../store/app.store';
import { UserCollection } from '../../models';
import { ProposalItemComponent } from '../proposal-item/proposal-item.component';

@Component({
  selector: 'app-proposals',
  standalone: true,
  imports: [CommonModule, ProposalItemComponent],
  templateUrl: './proposals.component.html',
  styleUrls: ['./proposals.component.scss'],
})
export class ProposalsComponent {
  readonly userCollection = input<UserCollection | null>(null);

  private readonly store = inject(AppStore);

  private readonly userSignal = this.store.user;
  private readonly proposalsSignal = this.store.proposals;
  private readonly formattedProposalsSignal = computed(() => {
    const user = this.userSignal();
    const proposals = this.proposalsSignal();
    if (!user?.id) {
      return { sent: [], received: [] };
    }
      return {
      sent: proposals.filter((p) => p.sender.id === user.id),
      received: proposals.filter((p) => p.receiver.id === user.id),
    };
  });

  private readonly activeTabSignal = signal<'sent' | 'received'>('sent');

  get activeTab(): 'sent' | 'received' {
    return this.activeTabSignal();
  }

  set activeTab(tab: 'sent' | 'received') {
    this.activeTabSignal.set(tab);
  }

  get formattedProposals() {
    return this.formattedProposalsSignal();
  }

  constructor() {
    effect(() => {
      const user = this.userSignal();
      const collection = this.userCollection();

      if (collection?.collection.id !== undefined) {
        this.store.loadProposals(collection.collection.id);
      }
    });
  }

  acceptProposal(proposal: Proposal) {
    this.store.acceptProposal(
      proposal.id,
      this.userCollection()?.collection.id!
    );
  }

  refuseProposal(proposal: Proposal) {
    this.store.refuseProposal(
      proposal.id,
      this.userCollection()?.collection.id!
    );
  }

  getOfferedItems(proposal: Proposal) {
    return proposal.items.filter((item) => item.user_id === proposal.sender.id);
  }

  getRequestedItems(proposal: Proposal) {
    return proposal.items.filter((item) => item.user_id !== proposal.sender.id);
  }
}
