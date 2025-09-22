import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  effect,
  input,
  inject,
  signal,
} from '@angular/core';
import { take, finalize } from 'rxjs/operators';
import { ProposalService } from '../../services/proposal.service';
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

  private readonly proposalService = inject(ProposalService);
  private readonly store = inject(AppStore);

  private readonly userSignal = this.store.user;
  private readonly proposalsSignal = signal<Proposal[]>([]);
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

  private readonly loadingSignal = signal(false);
  private readonly activeTabSignal = signal<'sent' | 'received'>('sent');

  get loading(): boolean {
    return this.loadingSignal();
  }

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

      if (!user?.id || !collection?.collection?.id) {
        this.proposalsSignal.set([]);
        return;
      }

      this.fetchProposals(collection.collection.id);
    });
  }

  private fetchProposals(collectionId: number) {
    this.loadingSignal.set(true);

    this.proposalService
      .getProposals(collectionId)
      .pipe(
        take(1),
        finalize(() => this.loadingSignal.set(false)),
      )
      .subscribe({
        next: (response) => {
          this.proposalsSignal.set(response.data ?? []);
        },
        error: () => {
          this.proposalsSignal.set([]);
        },
      });
  }

  acceptProposal(proposal: Proposal) {
    this.proposalService
      .acceptProposal(proposal.id)
      .pipe(take(1))
      .subscribe(() => {
        const collection = this.userCollection();
        if (collection?.collection?.id) {
          this.fetchProposals(collection.collection.id);
        }
      });
  }

  refuseProposal(proposal: Proposal) {
    this.proposalService
      .refuseProposal(proposal.id)
      .pipe(take(1))
      .subscribe(() => {
        const collection = this.userCollection();
        if (collection?.collection?.id) {
          this.fetchProposals(collection.collection.id);
        }
      });
  }

  getOfferedItems(proposal: Proposal) {
    return proposal.items.filter((item) => item.user_id === proposal.sender.id);
  }

  getRequestedItems(proposal: Proposal) {
    return proposal.items.filter((item) => item.user_id !== proposal.sender.id);
  }
}
