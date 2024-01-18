import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';
import { map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MembersService {

  baseUrl = environment.apiUrl;
  members: Member[] = [];
  constructor(private http: HttpClient) { }

  getMembers() {
    if(this.members.length > 0) return of(this.members);
    return this.http.get<Member[]>(this.baseUrl + 'users').pipe(
      map(members => {
        this.members = members;
        return members;
      })
    );
    // return this.http.get<Member[]>(this.baseUrl + 'users', this.getHttpOptions()); can be done by interceptors
    
  }

  getMember(username: string) {
    const member = this.members.find(x => x.userName === username);
    if(member) return of(member); //pakkanapakana tabs ki loading spinner avasaram lekunda data antha services lo store cheyadam annamata
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
