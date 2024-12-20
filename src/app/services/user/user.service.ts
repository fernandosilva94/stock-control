import { AuthResponse } from './../../models/interfaces/user/auth/AuthResponse';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthRequest } from 'src/app/models/interfaces/user/auth/AuthRequest';
import { SignUpUserRequest } from 'src/app/models/interfaces/user/SignUpUserRequest';
import { SignUpUserResponse } from 'src/app/models/interfaces/user/SignUpUserResponse';
import { environments } from 'src/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private API_URL = environments.API_URL;

  constructor(private http: HttpClient) { }

  signUpUser(requestDatas: SignUpUserRequest): Observable<SignUpUserResponse> {
    return this.http.post<SignUpUserResponse>(
      `${this.API_URL}/user`, requestDatas
    );
  };

  authUser(requestDatas: AuthRequest): Observable<AuthResponse> {
   return this.http.post<AuthResponse>(`${this.API_URL}/auth`, requestDatas); 
  };
  
};
