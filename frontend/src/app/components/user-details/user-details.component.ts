import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, signal } from '@angular/core';

@Component({
  selector: 'app-user-details',
  templateUrl: `./user-details.component.html`,
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./user-details.component.scss'],
})
export class UserDetailsComponent {
  @Output() mailboxClick = new EventEmitter<void>();
  @Output() logoutClick = new EventEmitter<void>();

  readonly menuOpen = signal(false);

  openMailbox() {
    this.mailboxClick.emit();
    this.menuOpen.set(false);
  }

  logout() {
    this.logoutClick.emit();
    this.menuOpen.set(false);
  }

  toggleMenu() {
    this.menuOpen.update((value) => !value);
  }

  showMenu() {
    this.menuOpen.set(true);
  }

  hideMenu() {
    this.menuOpen.set(false);
  }
}
