import {
  Component,
  ViewChild,
  ViewContainerRef,
  ComponentRef,
  DestroyRef,
  Type,
  inject,
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

  private readonly destroyRef = inject(DestroyRef);
  private currentComponent: ComponentRef<unknown> | null = null;

  private async loadComponent<T>(
    resolver: () => Promise<Type<T>>,
  ): Promise<ComponentRef<T>> {
    this.container.clear();
    this.currentComponent?.destroy();

    const componentType = await resolver();
    const componentRef = this.container.createComponent(componentType);
    this.destroyRef.onDestroy(() => componentRef.destroy());
    this.currentComponent = componentRef;
    return componentRef;
  }

  async loadMailbox() {
    await this.loadComponent(() =>
      import('../mailbox/mailbox.component').then((m) => m.MailboxComponent),
    );
  }

  async loadUserCollection(collection: UserCollection) {
    const componentRef = await this.loadComponent(() =>
      import('../collection-detail/collection-detail.component').then(
        (m) => m.CollectionDetailComponent,
      ),
    );
    componentRef.instance.collection = collection;
  }

  async loadAddToCollectionComponent() {
    await this.loadComponent(() =>
      import('../add-to-collection/add-to-collection.component').then(
        (m) => m.AddToCollectionComponent,
      ),
    );
  }

  async loadExchange(collection: UserCollection) {
    const componentRef = await this.loadComponent(() =>
      import('../collection-exchange/collection-exchange.component').then(
        (m) => m.CollectionExchangeComponent,
      ),
    );
    componentRef.instance.collection = collection;
  }

  async loadProposals(collection: UserCollection) {
    const componentRef = await this.loadComponent(() =>
      import('../proposals/proposals.component').then(
        (m) => m.ProposalsComponent,
      ),
    );
    componentRef.setInput("userCollection", collection);
  }

  async loadCollection(collection: Collection) {
    const componentRef = await this.loadComponent(() =>
      import('../admin/collection-form-component/collection-form-component.component').then(
        (m) => m.CollectionFormComponentComponent,
      ),
    );
    componentRef.instance.mode = 'edit';
    componentRef.instance.collection = collection;
  }

  async createCollection() {
    const componentRef = await this.loadComponent(() =>
      import('../admin/collection-form-component/collection-form-component.component').then(
        (m) => m.CollectionFormComponentComponent,
      ),
    );
    componentRef.instance.mode = 'create';
  }
}
