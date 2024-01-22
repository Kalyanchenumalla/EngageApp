import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Member } from 'src/app/_models/member';
import { MembersService } from 'src/app/_services/members.service';
import { MemberCardComponent } from "../member-card/member-card.component";
import { Observable, take } from 'rxjs';
import { Pagination } from 'src/app/_models/pagination';
import { userParams } from 'src/app/_models/userParams';
import { AccountService } from 'src/app/_services/account.service';
import { User } from 'src/app/_models/user';

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
  // pageNumber = 1;
  // pageSize = 5;
  userParams: userParams| undefined;
  // user: User | undefined;
  genderList = [{value: 'male', display:'Males'}, {value: 'female', display: 'Females'}]
  
  constructor(private memberService: MembersService, private accountService: AccountService) {
    // this.accountService.currentUser$.pipe(take(1)).subscribe({
    //   next: user => {
    //     if(user) {
    //       this.userParams = new userParams(user);
    //       this.user = user;
    //     }
    //   }
    // })
    this.userParams = this.memberService.getUserParams();
   }

  ngOnInit(): void {
    this.loadMembers();
    // this.members$ = this.memberService.getMembers();
    //use async pipe to automatically subscribe 
  }

  loadMembers() {
    if(this.userParams) {
      this.memberService.setUserParams(this.userParams);
      this.memberService.getMembers(this.userParams).subscribe({
        next: response => {
          if(response.result && response.pagination) {
            this.members = response.result;
            this.pagination = response.pagination;
          }
        }
      })
    }
  }

  resetFilters() {
    // if(this.user) {
      this.userParams = this.memberService.resetUserParams();
      this.loadMembers();
    // }
  }

  pageChanged(event: any) {
    if(this.userParams && this.userParams?.pageNumber !== event.page) {
      this.userParams.pageNumber = event.page;
      this.memberService.setUserParams(this.userParams);
      this.loadMembers();
    }
  }
}
