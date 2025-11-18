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
  template: `<ng-template #container></ng-template>`,
})
export class DynamicHostComponent {
  @ViewChild('container', { read: ViewContainerRef })
  container!: ViewContainerRef;

  private readonly destroyRef = inject(DestroyRef);
  private currentComponent: ComponentRef<unknown> | null = null;

  private async loadComponent<T>(
    resolver: () => Promise<Type<T>>,
    inputs?: Record<string, unknown>
  ): Promise<ComponentRef<T>> {
    this.container.clear();
    this.currentComponent?.destroy();

    const componentType = await resolver();
    const componentRef = this.container.createComponent(componentType);

    if (inputs) {
      Object.entries(inputs).forEach(([key, value]) => {
        componentRef.setInput(key, value as never);
      });
    }

    this.destroyRef.onDestroy(() => componentRef.destroy());
    this.currentComponent = componentRef;
    return componentRef;
  }

  async loadMailbox() {
    await this.loadComponent(() =>
      import('../mailbox/mailbox.component').then((m) => m.MailboxComponent)
    );
  }

  async loadUserCollection(collection: UserCollection) {
    await this.loadComponent(
      () =>
        import('../collection-detail/collection-detail.component').then(
          (m) => m.CollectionDetailComponent
        ),
      { collection }
    );
  }

  async loadAddToCollectionComponent() {
    await this.loadComponent(() =>
      import('../add-to-collection/add-to-collection.component').then(
        (m) => m.AddToCollectionComponent
      )
    );
  }

  async loadExchange(collection: UserCollection) {
    await this.loadComponent(
      () =>
        import('../collection-exchange/collection-exchange.component').then(
          (m) => m.CollectionExchangeComponent
        ),
      { collection }
    );
  }

  async loadProposals(collection: UserCollection) {
    await this.loadComponent(
      () =>
        import('../proposals/proposals.component').then(
          (m) => m.ProposalsComponent
        ),
      { userCollection: collection }
    );
  }

  async loadCollection(collection: Collection) {
    await this.loadComponent(
      () =>
        import(
          '../admin/collection-form-component/collection-form-component.component'
        ).then((m) => m.CollectionFormComponentComponent),
      { mode: 'edit', collection }
    );
  }

  async createCollection() {
    await this.loadComponent(
      () =>
        import(
          '../admin/collection-form-component/collection-form-component.component'
        ).then((m) => m.CollectionFormComponentComponent),
      { mode: 'create' }
    );
  }
}
