import { Injectable, inject } from '@angular/core';
import { Proposal } from '../models/proposal.model';
import { Observable } from 'rxjs';
import { ValidResponse } from '../models/valid-response.model';
import { NotificationService } from './notification.service';

@Injectable({ providedIn: 'root' })
export class ProposalService {
  private notificationService = inject(NotificationService);

  createProposal(data: {
    collection_id: number;
    receiver_id: number;
    offer: number[];
    need: number[];
  }): Observable<any> {
    return this.notificationService.requestWithNotification<any>(
      'post',
      `create_proposal`,
      true,
      data,
      'Proposal created successfully',
      'Failed to create proposal'
    );
  }

  acceptProposal(id: number): Observable<any> {
    return this.notificationService.requestWithNotification<any>(
      'put',
      `accept_proposal/${id}`,
      true,
      {},
      'Proposal accepted successfully',
      'Failed to accept proposal'
    );
  }

  refuseProposal(id: number): Observable<any> {
    return this.notificationService.requestWithNotification<any>(
      'put',
      `refuse_proposal/${id}`,
      true,
      {},
      'Proposal refused successfully',
      'Failed to refuse proposal'
    );
  }

  getProposals(collectionId: number): Observable<ValidResponse<Proposal[]>> {
    return this.notificationService.requestWithNotification<
      ValidResponse<Proposal[]>
    >(
      'get',
      `get_proposals/${collectionId}`,
      true,
      {},
      'Proposals fetched successfully',
      'Failed to fetch proposals'
    );
  }

  getProposal(id: number): Observable<Proposal> {
    return this.notificationService.requestWithNotification<Proposal>(
      'get',
      `get_proposal/${id}`,
      true,
      {},
      'Proposal fetched successfully',
      'Failed to fetch proposal'
    );
  }
}
