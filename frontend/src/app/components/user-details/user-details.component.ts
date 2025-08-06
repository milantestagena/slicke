import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

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
  constructor() {}

  openMailbox() {
    // Navigate to the mailbox route
    this.mailboxClick.emit();
  }

  logout() {
    // Emit an event to notify the parent component to handle logout
    this.logoutClick.emit();
  }
}
