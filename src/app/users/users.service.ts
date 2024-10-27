import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private http: HttpClient) {}
  public usersListData$ = new BehaviorSubject<any>(null);

  public getUsers(params: any, keyword?: string) {
    return this.http.get(
      `https://dummyjson.com/users/${keyword ? `search?q=${keyword}` : ''}`,
      {
        params,
      }
    );
  }
}
