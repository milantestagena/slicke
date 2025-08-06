import { Injectable, inject } from '@angular/core';
import { HTTPService } from './http.service';
import { Proposal } from '../models/proposal.model';
import { Observable } from 'rxjs';
import { ValidResponse } from '../models/valid-response.model';

@Injectable({ providedIn: 'root' })
export class ProposalService {
  private http = inject(HTTPService);

  createProposal(data: {
    collection_id: number;
    receiver_id: number;
    offer: number[];
    need: number[];
  }): void {
    this.http.requestWithNotification<any>(
      'post',
      `create_proposal`,
      true,
      data,
      'Proposal created successfully',
      'Failed to create proposal'
    ).subscribe();
  }

  acceptProposal(id: number): Observable<any> {
    return this.http.requestWithNotification<any>(
      'put',
      `accept_proposal/${id}`,
      true,
      {},
      'Proposal accepted successfully',
      'Failed to accept proposal'
    );
  }

  refuseProposal(id: number): Observable<any> {
    return this.http.requestWithNotification<any>(
      'put',
      `refuse_proposal/${id}`,
      true,
      {},
      'Proposal refused successfully',
      'Failed to refuse proposal'
    );
  }

  getProposals(collectionId: number): Observable<ValidResponse<Proposal[]>> {
    return this.http.requestWithNotification<ValidResponse<Proposal[]>>(
      'get',
      `get_proposals/${collectionId}`,
      true,
      {},
      'Proposals fetched successfully',
      'Failed to fetch proposals'
    );
  }

  getProposal(id: number): Observable<Proposal> {
    return this.http.requestWithNotification<Proposal>(
      'get',
      `get_proposal/${id}`,
      true,
      {},
      'Proposal fetched successfully',
      'Failed to fetch proposal'
    );
  }
}
