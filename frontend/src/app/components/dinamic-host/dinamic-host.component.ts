import {
  Component,
  ViewChild,
  ViewContainerRef,
  ComponentRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Collection, UserCollection } from '../../models';

@Component({
  selector: 'app-dynamic-host',
  standalone: true,
  imports: [CommonModule],
  template: ` <ng-template #container></ng-template> `,
})
export class DynamicHostComponent {
  @ViewChild('container', { read: ViewContainerRef })
  container!: ViewContainerRef;

  private currentComponent: ComponentRef<any> | null = null;

  async loadMailbox() {
    this.container.clear();
    const { MailboxComponent } = await import('../mailbox/mailbox.component');
    this.currentComponent = this.container.createComponent(MailboxComponent);
  }

  async loadCollection(collection: UserCollection) {
    this.container.clear();
    const { CollectionDetailComponent } = await import(
      '../collection-detail/collection-detail.component'
    );
    this.currentComponent = this.container.createComponent(
      CollectionDetailComponent
    );
    this.currentComponent.instance.collection = collection;
  }

  async loadAddToCollectionComponent() {
    this.container.clear();
    const { AddToCollectionComponent } = await import(
      '../add-to-collection/add-to-collection.component'
    );
    this.container.createComponent(AddToCollectionComponent);
  }

  async loadExchange(collection: UserCollection) {
    this.container.clear();
    const { CollectionExchangeComponent } = await import(
      '../collection-exchange/collection-exchange.component'
    );
    this.currentComponent = this.container.createComponent(
      CollectionExchangeComponent
    );
    this.currentComponent.instance.collection = collection;
  }

  async loadProposals(collection: UserCollection) {
    this.container.clear();
    const { ProposalsComponent } = await import(
      '../proposals/proposals.component'
    );
    this.currentComponent = this.container.createComponent(ProposalsComponent);
    this.currentComponent.instance.userCollection = collection;
  }
}
