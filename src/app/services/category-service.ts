import { Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { ICategory, ICategoryRequest } from '../interfaces/IPatient.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private _apiUrl = environment.apiUrl;
  categories: WritableSignal<ICategory[]> = signal([]);

  constructor(private http: HttpClient) {}

  getCategories(): WritableSignal<ICategory[]> {
    this.http.get<ICategory[]>(`${this._apiUrl}/category`).subscribe(res => {
      this.categories.set(res)
    })
    return this.categories;
  }

  updateCategory(category: ICategory): void {
    this.http.post<ICategory>(`${this._apiUrl}/category/update`, category).subscribe(res => {
      this.getCategories();
    })
  }

  createCategory(category: ICategoryRequest): void {
    this.http.post<ICategory>(`${this._apiUrl}/category`, category).subscribe(newCategory => {
      this.getCategories();
    })
  }

  deleteCategory(category: ICategory): void {
    this.http.post<void>(`${this._apiUrl}/category/delete`, { id: category.id }).subscribe(() => {
      this.getCategories();
    })
  }

  checkCategoryDelete(category: ICategory): Observable<number> {
    return this.http.post<number>(`${this._apiUrl}/category/verifydelete`, { id: category.id });
  }

}
