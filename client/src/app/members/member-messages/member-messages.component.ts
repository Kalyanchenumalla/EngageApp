import { ChangeDetectionStrategy, Component, Input, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Message } from 'src/app/_models/message';
import { MessageService } from 'src/app/_services/message.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrl: './member-messages.component.css'
})
export class MemberMessagesComponent {
  @ViewChild('messageForm') messageForm?: NgForm
  //this is a child of member detail
  @Input() username?: string;
  // @Input() messages: Message[] = [];
  messageContent = '';
  constructor(public messageService: MessageService) {}

  ngOnInit() {
    // this.loadMessages();
  }

  // loadMessages() {
  //   if(this.username) {
  //     this.messageService.getMessageThread(this.username).subscribe({
  //       next: messages =>
  //        this.messages = messages
  //       console.log(messages)
  //     })
  //   }
  // }

  sendMessage() {
    if(!this.username) return;
    this.messageService.sendMessage(this.username, this.messageContent).then(() => {
      this.messageForm?.reset();
    })
      // next: message => {
        // this.messages.push(message);
        // this.messageForm?.reset()
      // }
    
  }
}
