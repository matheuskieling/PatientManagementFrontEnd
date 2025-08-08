import { Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { IHealthPlan, IHealthPlanRequest } from '../interfaces/IPatient.model';

@Injectable({
  providedIn: 'root'
})
export class HealthPlanService {
  private _apiUrl = environment.apiUrl;

  healthPlans: WritableSignal<IHealthPlan[]> = signal([]);

  constructor(private http: HttpClient) {}

  getHealthPlans(): WritableSignal<IHealthPlan[]> {
    this.http.get<IHealthPlan[]>(`${this._apiUrl}/healthPlan`).subscribe(res => {
      this.healthPlans.set(res)
    })
    return this.healthPlans;
  }

  updateHealthPlan(healthPlan: IHealthPlan): void {
    this.http.post<IHealthPlan>(`${this._apiUrl}/healthPlan/update`, healthPlan).subscribe(res => {
      this.getHealthPlans()
    })
  }

  createHealthPlan(healthPlan: IHealthPlanRequest): void {
    this.http.post<IHealthPlan>(`${this._apiUrl}/healthPlan`, healthPlan).subscribe(newHealthPlan => {
      this.getHealthPlans()
    })
  }

  deleteHealthPlan(healthPlan: IHealthPlan): void {
    this.http.post<void>(`${this._apiUrl}/healthPlan/delete`, { id: healthPlan.id }).subscribe(() => {
      this.getHealthPlans();
    })
  }

  checkHealthPlanDelete(healthPlan: IHealthPlan): Observable<number> {
    return this.http.post<number>(`${this._apiUrl}/healthPlan/verifydelete`, { id: healthPlan.id });
  }
}
