import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Member } from 'src/app/_models/member';
import { MembersService } from 'src/app/_services/members.service';
import { ActivatedRoute } from '@angular/router';
import { Gallery, GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { MessageService } from 'src/app/_services/message.service';
import { Message } from 'src/app/_models/message';
import { PresenceService } from 'src/app/_services/presence.service';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrl: './member-detail.component.css',
})
export class MemberDetailComponent implements OnInit, OnDestroy{
  @ViewChild('memberTabs', {static: true}) memberTabs?: TabsetComponent
  member: Member = {} as Member;
  images: GalleryItem[] = [];
  activeTab?: TabDirective;
  messages: Message[]= [];
  user?: User;

  constructor(private memberService: MembersService, private route: ActivatedRoute, private messageService: MessageService, public presenceService: PresenceService, private accountService: AccountService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => {
        if(user) this.user = user;
      }
    })
  }

  ngOnInit(): void {
    // this.loadMember();
    this.route.data.subscribe({
      next: data => this.member = data['member']
    })

    this.route.queryParams.subscribe({
      next: params => {
        params['tab'] && this.selectTab(params['tab'])
      }
    })

    this.getImages();
  }

  ngOnDestroy(): void {
      this.messageService.stopHubConnection();
  }

  onTabActivated(data: TabDirective) {
    this.activeTab = data;
    if(this.activeTab.heading === 'Messages' && this.user) {
      this.messageService.createHubConnection(this.user, this.member.userName);
      // this.loadMessages();
    } else {
      this.messageService.stopHubConnection();
    }
  }

  selectTab(heading: string) {
    if(this.memberTabs) {
      this.memberTabs.tabs.find(x => x.heading === heading)!.active = true;
    }
  }

  loadMessages() {
    if(this.member) {
      this.messageService.getMessageThread(this.member.userName).subscribe({
        next: messages => this.messages = messages
      })
    }
  }

  // loadMember() {
  //   const username = this.route.snapshot.paramMap.get('username')
  //   if(!username) return;
  //   this.memberService.getMember(username).subscribe({
  //     next: member => {
  //       this.member = member,
  //       this.getImages()
  //     }
  //   })
  //   this.getImages();
  // }

  getImages() {
    if(!this.member) return;
    for(const photo of this.member.photos) {
      this.images.push(new ImageItem({src: photo.url, thumb: photo.url}));
      // console.log(this.member.photos);
    }
  }
}
