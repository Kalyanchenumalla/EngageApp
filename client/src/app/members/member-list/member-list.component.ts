import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Member } from 'src/app/_models/member';
import { MembersService } from 'src/app/_services/members.service';
import { MemberCardComponent } from "../member-card/member-card.component";
import { Observable } from 'rxjs';

@Component({
    selector: 'app-member-list',
    templateUrl: './member-list.component.html',
    styleUrl: './member-list.component.css',
    // encapsulation: ViewEncapsulation.Emulated
})
export class MemberListComponent implements OnInit {
  // members: Member[] = [];
  members$: Observable<Member[]> | undefined;

  
  constructor(private memberService: MembersService) { }

  ngOnInit(): void {
    // this.loadMembers();
    this.members$ = this.memberService.getMembers();
    //use async pipe to automatically subscribe 
  }

  // loadMembers() {
  //   this.memberService.getMembers().subscribe({
  //     next: members => this.members = members
  //   })
  // }
}
