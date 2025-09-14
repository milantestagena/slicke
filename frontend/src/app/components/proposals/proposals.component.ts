import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProposalService } from '../../services/proposal.service';
import { Proposal } from '../../models/proposal.model';
import { AppStore } from '../../store/app.store';
import { User, UserCollection } from '../../models';
import { ProposalItemComponent } from '../proposal-item/proposal-item.component';

@Component({
  selector: 'app-proposals',
  standalone: true,
  imports: [CommonModule, ProposalItemComponent],
  templateUrl: './proposals.component.html',
  styleUrls: ['./proposals.component.scss'],
})
export class ProposalsComponent {
  private proposalService = inject(ProposalService);
  private store = inject(AppStore);

  user: User | null = null;
  proposals: Proposal[] = [];
  formattedProposals: { sent: Proposal[]; received: Proposal[] } = {
    sent: [],
    received: [],
  };
  loading = false;

  activeTab: 'sent' | 'received' = 'sent';

  private _userCollection!: UserCollection;

  @Input()
  set userCollection(value: UserCollection) {
    if (!value) return;
    this._userCollection = value;
    this.loadProposals();
  }

  private loadProposals() {
    this.user = this.store.getUser() as User;
    if (!this.user || !this._userCollection?.collection?.id) return;

    this.loading = true;

    this.proposalService
      .getProposals(this._userCollection.collection.id)
      .subscribe({
        next: (response) => {
          this.proposals = response.data;
          this.formattedProposals = {
            sent: this.proposals.filter((p) => p.sender.id === this.user?.id),
            received: this.proposals.filter(
              (p) => p.receiver.id === this.user?.id
            ),
          };
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  acceptProposal(proposal: Proposal) {
    this.proposalService.acceptProposal(proposal.id).subscribe(() => {
      // osveži listu ili ažuriraj status
    });
  }

  refuseProposal(proposal: Proposal) {
    this.proposalService.refuseProposal(proposal.id).subscribe(() => {
      // osveži listu ili ukloni iz prikaza
    });
  }

  getOfferedItems(proposal: Proposal) {
    return proposal.items.filter((item) => item.user_id === proposal.sender.id);
  }

  getRequestedItems(proposal: Proposal) {
    return proposal.items.filter((item) => item.user_id !== proposal.sender.id);
  }


}
