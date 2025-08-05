import { Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { IPatient } from '../interfaces/IPatient.model';
import { IPageable } from '../interfaces/IPageable.model';
import { FormGroup } from '@angular/forms';

export interface IPatientFilters {
  fileNumber?: number | null,
  birthDate?: Date | null,
  healthPlan?: string | null,
  name?: string | null,
  gender?: 'M' | 'F' | null,
  cpf?: string | null,
  address?: string | null,
  phones?: string | null,
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
  patients: WritableSignal<IPageable<IPatient>> = signal<IPageable<IPatient>>({
    page: 1,
    pageSize: 10,
    totalResults: 0,
    totalPages: 1,
    items: []
  });
  filters: IPatientFilters = {} as IPatientFilters

  filtersToUrlParams(filters: IPatientFilters): string {
    const params = new URLSearchParams();
    if (filters.fileNumber != null) params.append('fileNumber', filters.fileNumber.toString());
    if (filters.birthDate) params.append('birthDate', filters.birthDate.toISOString());
    if (filters.healthPlan) params.append('healthPlan', filters.healthPlan);
    if (filters.name) params.append('name', filters.name);
    if (filters.cpf) params.append('cpf', filters.cpf);
    if (filters.address) params.append('address', filters.address);
    if (filters.phones) params.append('phones', filters.phones);
    if (filters.gender) params.append('gender', filters.gender);
    if (filters.category) params.append('category', filters.category);
    if (filters.isArchived != null) params.append('isArchived', filters.isArchived.toString());
    params.append('pageNumber', (filters.pageNumber ? filters.pageNumber : 1).toString());
    params.append('pageSize', (filters.pageSize ? filters.pageSize : 10).toString());

    return `?${params.toString()}`;
  }

  setFilters(formValues: FormGroup) {
    this.filters = this.formToFilters(formValues);
    console.log(this.filters)
    this.getPatients();
  }

  formToFilters(formValues: FormGroup): IPatientFilters {
    return {
      fileNumber: formValues.get('record')?.value,
      birthDate: formValues.get('birthDate')?.value,
      healthPlan: formValues.get('healthPlan')?.value,
      name: formValues.get('name')?.value,
      gender: formValues.get('gender')?.value,
      cpf: formValues.get('cpf')?.value,
      phones: formValues.get('phone')?.value,
      category: formValues.get('category')?.value,
      isArchived: formValues.get('archived')?.value,
    } as IPatientFilters;
  }

  getPatients(): void {
    this.http.get<IPageable<IPatient>>(`${this._apiUrl}/patient/list${this.filtersToUrlParams(this.filters)}`).subscribe(patients => {
      this.patients.set(patients);
    });
  }
  setPage(page: number): void {
    this.filters.pageNumber = page;
    this.getPatients();
  }
}
