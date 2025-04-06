import { Component } from '@angular/core';
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
  constructor(private router: Router) {}

  goToMailbox() {
    // Navigate to the mailbox route
    this.router.navigate(['/mailbox']);
  }
}
