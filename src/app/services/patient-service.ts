import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { IPatient } from '../interfaces/IPatient.model';
import { IPageable } from '../interfaces/IPageable.model';

export interface IPatientFilters {
  fileNumber?: number | null,
  birthDate?: Date | null,
  healthPlan?: string | null,
  name?: string | null,
  cpf?: string | null,
  address?: string | null,
  phones?: string | null,
  responsible?: string | null,
  category?: string | null,
  isArchived?: boolean,
  pageNumber: number,
  pageSize: number
}

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private _apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  filtersToUrlParams(filters: IPatientFilters): string {
    const params = new URLSearchParams();
    if (filters.fileNumber != null) params.append('fileNumber', filters.fileNumber.toString());
    if (filters.birthDate) params.append('birthDate', filters.birthDate.toISOString());
    if (filters.healthPlan) params.append('healthPlan', filters.healthPlan);
    if (filters.name) params.append('name', filters.name);
    if (filters.cpf) params.append('cpf', filters.cpf);
    if (filters.address) params.append('address', filters.address);
    if (filters.phones) params.append('phones', filters.phones);
    if (filters.responsible) params.append('responsible', filters.responsible);
    if (filters.category) params.append('category', filters.category);
    if (filters.isArchived != null) params.append('isArchived', filters.isArchived.toString());
    params.append('pageNumber', (filters.pageNumber ? filters.pageNumber : 1).toString());
    params.append('pageSize', (filters.pageSize ? filters.pageSize : 10).toString());

    return `?${params.toString()}`;
  }

  getPatients(filters: IPatientFilters): Observable<IPageable<IPatient>> {
    return this.http.get<IPageable<IPatient>>(`${this._apiUrl}/patient/list${this.filtersToUrlParams(filters)}`);
  }
}
