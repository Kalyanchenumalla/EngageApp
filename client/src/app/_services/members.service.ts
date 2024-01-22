import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';
import { map, of, take } from 'rxjs';
import { PaginatedResult } from '../_models/pagination';
import { userParams } from '../_models/userParams';
import { AccountService } from './account.service';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class MembersService {

  baseUrl = environment.apiUrl;
  members: Member[] = [];
  memberCache = new Map(); //using map gives get and set
  user: User | undefined;
  userParams: userParams | undefined;
  // paginatedResult: PaginatedResult<Member[]> = new PaginatedResult<Member[]>;
  constructor(private http: HttpClient, private accountService: AccountService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => {
        if(user) {
          this.user = user;
          this.userParams = new userParams(user);
        }
      }
    })
  }

  getUserParams() {
    return this.userParams;
  }

  setUserParams(params: userParams) {
    this.userParams = params;
  }

  resetUserParams() {
    if(this.user) {
      this.userParams = new userParams(this.user);
      return this.userParams;
    }
    return;
  }
  
  getMembers(userParams: userParams) {
    const response = this.memberCache.get(Object.values(userParams).join('-'));
    if(response) return of(response);
    // console.log(Object.values(userParams).join('-'));
      let params = this.getPaginationHeaders(userParams.pageNumber, userParams.pageSize);
      // if(this.members.length > 0) return of(this.members);
      params = params.append('minAge', userParams.minAge);
      params = params.append('maxAge', userParams.maxAge);
      params = params.append('gender', userParams.gender);
      params = params.append('orderBy', userParams.orderBy);
      return this.getPaginatedResult<Member[]>(this.baseUrl + 'users', params).pipe(
        map(response => {
          this.memberCache.set(Object.values(userParams).join('-'), response);
          return response;
        })
      );
      // map(members => {
      //   this.members = members;
      //   return members;
      // })
    // return this.http.get<Member[]>(this.baseUrl + 'users', this.getHttpOptions()); can be done by interceptors
    
  }

  getMember(username: string) {
    // const member = this.members.find(x => x.userName === username);
    // if(member) return of(member); //pakkanapakana tabs ki loading spinner avasaram lekunda data antha services lo store cheyadam annamata
    const member = [...this.memberCache.values()].reduce((arr, elem) => arr.concat(elem.result), []).find((member: Member) => member.userName === username);
    if(member) return of(member);

    return this.http.get<Member>(this.baseUrl + 'users/' + username);
  }

  updateMember(member: Member) { //edge case to  pakkana pakkana loading ki
    return this.http.put(this.baseUrl + 'users', member).pipe(
      map(() => {
        const index = this.members.indexOf(member);
        this.members[index] = {...this.members[index], ...member}
      })
    );
  }

  setMainPhoto(photoId: number) {
    return this.http.put(this.baseUrl + 'users/set-main-photo/' + photoId, {});
  }

  deletePhoto(photoId: number) {
    return this.http.delete(this.baseUrl + 'users/delete-photo/' + photoId);
  }

  
  private getPaginatedResult<T>(url: string, params: HttpParams) { //T is making generic
    const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>;
    return this.http.get<T>(url, { observe: 'response', params }).pipe(
      map(response => {
        if (response.body) {
          paginatedResult.result = response.body;
        }
        const pagination = response.headers.get('Pagination');
        if (pagination) {
          paginatedResult.pagination = JSON.parse(pagination);
        }
        return paginatedResult;
      })
    );
  }

  private getPaginationHeaders(pageNumber: number, pageSize: number) {
    let params = new HttpParams();
    // if (page && itemsPerPage) {
      params = params.append('pageNumber', pageNumber);
      params = params.append('pageSize', pageSize);
    // }
    return params;
  }


  // getHttpOptions() {
  //   const userString = localStorage.getItem('user');
  //   if(!userString) return;
  //   const user = JSON.parse(userString);
  //   return {
  //     headers: new HttpHeaders({
  //       Authorization: 'Bearer ' + user.token
  //     })
  //   }
  // }
}
