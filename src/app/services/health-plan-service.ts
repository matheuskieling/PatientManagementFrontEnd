import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { IHealthPlan } from '../interfaces/IPatient.model';

@Injectable({
  providedIn: 'root'
})
export class HealthPlanService {
  private _apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getHealthPlans(): Observable<IHealthPlan[]> {
    return this.http.get<IHealthPlan[]>(`${this._apiUrl}/category`);
  }

}
