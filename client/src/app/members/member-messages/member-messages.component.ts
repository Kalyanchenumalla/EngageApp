import { Component, Input, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Message } from 'src/app/_models/message';
import { MessageService } from 'src/app/_services/message.service';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrl: './member-messages.component.css'
})
export class MemberMessagesComponent {
  @ViewChild('messageForm') messageForm?: NgForm
  //this is a child of member detail
  @Input() username?: string;
  @Input() messages: Message[] = [];
  messageContent = '';
  constructor(private messageService: MessageService) {}

  ngOnInit() {
    this.loadMessages();
  }

  loadMessages() {
    if(this.username) {
      this.messageService.getMessageThread(this.username).subscribe({
        next: messages => this.messages = messages
      })
    }
  }

  sendMessage() {
    if(!this.username) return;
    this.messageService.sendMessage(this.username, this.messageContent).subscribe({
      next: message => {
        this.messages.push(message);
        this.messageForm?.reset()
      }
    })
  }
}
