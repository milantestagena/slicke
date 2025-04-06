import { Component, ViewChild, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'app-dynamic-host',
  template: ` <ng-template #container></ng-template> `,
})
export class DynamicHostComponent {
  @ViewChild('container', { read: ViewContainerRef })
  container!: ViewContainerRef;

  constructor() {}
  ngAfterViewInit() {
    this.loadComponent();
  }
  async loadComponent() {
    console.log('loadComponent');
    this.container.clear();

    const { MailboxComponent } = await import('../mailbox/mailbox.component');
    this.container.createComponent(MailboxComponent);
  }
}
