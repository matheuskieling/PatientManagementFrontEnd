import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { ICategory } from '../interfaces/IPatient.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private _apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getCategories(): Observable<ICategory[]> {
    return this.http.get<ICategory[]>(`${this._apiUrl}/category`);
  }

}
