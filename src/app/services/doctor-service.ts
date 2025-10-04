import { Injectable, signal, WritableSignal } from '@angular/core';
import { environment } from '../../environments/environment';
import { IDoctor, IDoctorRequest } from '../interfaces/IPatient.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private _apiUrl = environment.apiUrl;

  doctors: WritableSignal<IDoctor[]> = signal([]);

  constructor(private http: HttpClient) {}

  getDoctors(): WritableSignal<IDoctor[]> {
    this.http.get<IDoctor[]>(`${this._apiUrl}/doctor`).subscribe(res => {
      this.doctors.set(res)
    })
    return this.doctors;
  }

  updateDoctor(doctor: IDoctor): void {
    this.http.put<IDoctor>(`${this._apiUrl}/doctor`, doctor).subscribe(res => {
      this.getDoctors()
    })
  }

  createDoctor(doctor: IDoctorRequest): void {
    this.http.post<IDoctor>(`${this._apiUrl}/doctor`, doctor).subscribe(newDoctor => {
      this.getDoctors()
    })
  }

  deleteDoctor(doctor: IDoctor): void {
    this.http.delete<void>(`${this._apiUrl}/doctor/${doctor.id}`).subscribe(() => {
      this.getDoctors();
    })
  }
}
