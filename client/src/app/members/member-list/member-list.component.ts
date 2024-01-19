import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Member } from 'src/app/_models/member';
import { MembersService } from 'src/app/_services/members.service';
import { MemberCardComponent } from "../member-card/member-card.component";
import { Observable } from 'rxjs';
import { Pagination } from 'src/app/_models/pagination';

@Component({
    selector: 'app-member-list',
    templateUrl: './member-list.component.html',
    styleUrl: './member-list.component.css',
    // encapsulation: ViewEncapsulation.Emulated
})
export class MemberListComponent implements OnInit {
  // members: Member[] = [];
  // members$: Observable<Member[]> | undefined;
  members: Member[] = [];
  pagination: Pagination | undefined;
  pageNumber = 1;
  pageSize = 5;

  
  constructor(private memberService: MembersService) { }

  ngOnInit(): void {
    this.loadMembers();
    // this.members$ = this.memberService.getMembers();
    //use async pipe to automatically subscribe 
  }

  loadMembers() {
    this.memberService.getMembers(this.pageNumber, this.pageSize).subscribe({
      next: response => {
        if(response.result && response.pagination) {
          this.members = response.result;
          this.pagination = response.pagination;
        }
      }
    })
  }

  pageChanged(event: any) {
    if(this.pageNumber !== event.page) {
      this.pageNumber = event.page;
      this.loadMembers();
    }
  }
}
