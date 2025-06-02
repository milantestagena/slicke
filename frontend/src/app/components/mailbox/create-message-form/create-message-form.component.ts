import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-message-form',
  templateUrl: './create-message-form.component.html',
  styleUrls: ['./create-message-form.component.scss'],
  imports: [CommonModule, FormsModule]
})
export class CreateMessageFormComponent {
  recipient = '';
  message = '';

  @Output() formSubmit = new EventEmitter<{ recipient: string; message: string }>();

  submitForm() {
    this.formSubmit.emit({ recipient: this.recipient, message: this.message });
  }
}
