import { Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import {
  IContactRequest,
  INextNumbersResponse,
  IPatient,
  IPatientRequest,
  IValidationResults
} from '../interfaces/IPatient.model';
import { IPageable } from '../interfaces/IPageable.model';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

export interface IPatientFilters {
  fileNumber?: number | null,
  fileNumberEco?: number | null,
  birthDate?: Date | null,
  healthPlan?: string | null,
  name?: string | null,
  gender?: 'M' | 'F' | null,
  cpf?: string | null,
  rg?: string | null,
  address?: string | null,
  phones?: string | null,
  category?: string | null,
  pageNumber: number,
  pageSize: number
}

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private _apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}
  page: WritableSignal<number> = signal<number>(1);
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
    if (filters.fileNumberEco != null) params.append('fileNumberEco', filters.fileNumberEco.toString());
    if (filters.birthDate) params.append('birthDate', filters.birthDate.toISOString());
    if (filters.healthPlan) params.append('healthPlan', filters.healthPlan);
    if (filters.name) params.append('name', filters.name);
    if (filters.cpf) params.append('cpf', filters.cpf);
    if (filters.rg) params.append('rg', filters.rg);
    if (filters.address) params.append('address', filters.address);
    if (filters.phones) params.append('phones', filters.phones);
    if (filters.gender) params.append('gender', filters.gender);
    if (filters.category) params.append('category', filters.category);
    params.append('pageNumber', (this.page()).toString());
    params.append('pageSize', (filters.pageSize ? filters.pageSize : 10).toString());

    return `?${params.toString()}`;
  }

  setFilters(formValues: FormGroup) {
    this.filters = this.formToFilters(formValues);
    this.getPatients();
  }

  formToFilters(formValues: FormGroup): IPatientFilters {
    return {
      fileNumber: formValues.get('record')?.value,
      fileNumberEco: formValues.get('recordEco')?.value,
      birthDate: this.getDateFromForm(formValues.get('birthDate')?.value),
      healthPlan: formValues.get('healthPlan')?.value,
      name: formValues.get('name')?.value,
      gender: formValues.get('gender')?.value,
      cpf: formValues.get('cpf')?.value,
      rg: formValues.get('rg')?.value,
      phones: formValues.get('phone')?.value,
      category: formValues.get('category')?.value,
    } as IPatientFilters;
  }

  getDateFromForm(date: string): Date | null {
    if (!date) return null;
    const parts = date.split('/');
    if (parts.length !== 3) return null;
    const day = parseInt(parts[0])
    const month= parseInt(parts[1])
    const year = parseInt(parts[2]);

    return new Date(year, month - 1, day);
  }
  getFieldValueForString(str: string | null) {
    if (!str) return null;
    if (str.length) return str;
    return null;
  }
  getFieldValueForNumber(num: number | string | null) : number | null {
    if (num === null || num === undefined) return null;
    if (typeof num === 'number') return num;
    if (typeof num === 'string' && num.trim() === '') return null;
    const parsed = parseFloat(num);
    return isNaN(parsed) ? null : parsed;
  }
  addFormToPatient(formValues: FormGroup): IPatientRequest {
    return {
      fileNumber: this.getFieldValueForNumber(formValues.get('record')?.value),
      fileNumberEco: this.getFieldValueForNumber(formValues.get('recordEco')?.value),
      birthDate: this.getDateFromForm(formValues.get('birthDate')?.value),
      healthPlanName: this.getFieldValueForString(formValues.get('healthPlan')?.value),
      healthPlanNumber: this.getFieldValueForString(formValues.get('healthPlanNumber')?.value),
      name: this.getFieldValueForString(formValues.get('name')?.value),
      address: this.getFieldValueForString(formValues.get('address')?.value),
      gender: this.getFieldValueForString(formValues.get('gender')?.value),
      cpf: this.getFieldValueForString(formValues.get('cpf')?.value),
      rg: this.getFieldValueForString(formValues.get('rg')?.value),
      phone: this.getFieldValueForString(formValues.get('phone')?.value),
      contacts: formValues.get('contactName')?.value || formValues.get('contactPhone')?.value ? [
        {
          phone: formValues.get('contactPhone')?.value,
          name: formValues.get('contactName')?.value
        } as IContactRequest
      ] : [],
      categoryName: this.getFieldValueForString(formValues.get('category')?.value),
    } as IPatientRequest
  }

  getPatients(): void {
    this.http.get<IPageable<IPatient>>(`${this._apiUrl}/patient/list${this.filtersToUrlParams(this.filters)}`).subscribe(patients => {
      this.patients.set(patients);
    });
  }

  getPatientById(patientId: string): Observable<IPatient> {
    return this.http.get<IPatient>(`${this._apiUrl}/patient/${patientId}`);
  }

  getPatientByCpf(cpf: string): Observable<IPatient> {
    return this.http.get<IPatient>(`${this._apiUrl}/patient/cpf/${cpf}`);
  }

  getPatientByRg(rg: string): Observable<IPatient> {
    return this.http.get<IPatient>(`${this._apiUrl}/patient/rg/${rg}`);
  }
  validatePatient(formValues: FormGroup, patient?: IPatient): Observable<IValidationResults> {
    var validatePatient = this.addFormToPatient(formValues);
    if (patient) validatePatient.id = patient.id;
    return this.http.post<IValidationResults>(`${this._apiUrl}/patient/validate`, validatePatient);
  }

  createPatient(formValues: FormGroup): Observable<IPatient> {
    var patient = this.addFormToPatient(formValues);
    return this.http.post<IPatient>(`${this._apiUrl}/patient/create`, patient);
  }

  updatePatient(formValues: FormGroup, patient: IPatient): Observable<IPatient> {
    var updatedPatient = this.addFormToPatient(formValues);
    updatedPatient.id = patient.id;
    return this.http.post<IPatient>(`${this._apiUrl}/patient/update`, updatedPatient);
  }

  deletePatient(patientId: string): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      this.http.post(`${this._apiUrl}/patient/delete/${patientId}`, {}).subscribe({
        next: () => {
          this.getPatients();
          observer.next(true);
          observer.complete();
        },
        error: (err) => {
          console.error('Error deleting patient:', err);
          observer.next(false);
          observer.complete();
        }
      });
    });
  }
  getNextFileNumbers() : Observable<INextNumbersResponse> {
    return this.http.get<INextNumbersResponse>(`${this._apiUrl}/patient/GetNextFileNumber`);
  }
}
