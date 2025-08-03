import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { IAuth } from '../interfaces/IAuth.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _apiUrl = environment.apiUrl;
  private _router: Router = inject(Router);
  constructor(private http: HttpClient) {}

  login(username: string, password: string): void {
    this.http.post<IAuth>(`${this._apiUrl}/auth/login`, { username, password }).subscribe(response => {
      localStorage.setItem('token', response.token);
      this._router.navigate(['/home']);
    });
  }

  register(username: string, password: string): void {
    this.http.post<IAuth>(`${this._apiUrl}/auth/register`, { username, password }).subscribe(_ => {
      this._router.navigate(['/login']);
    });
  }

  logout(): void {
    localStorage.removeItem('token');
    this._router.navigate(['/login']);
  }
}
