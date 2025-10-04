import { computed, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { IClosing, IPayment, IPaymentRequest } from '../interfaces/IPayment.model';
import { FormGroup } from '@angular/forms';
import { PaymentMethod } from '../../enums/enums';
import { map, Observable, tap } from 'rxjs';

export interface IPaymentFilters {
  healthPlanId?: string | null;
  paymentMethods: PaymentMethod[];
  startDate: Date;
  endDate: Date;
  doctorId?: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private _apiUrl = environment.apiUrl;

  payments: WritableSignal<IPayment[]> = signal([]);
  tableClosing: Signal<IClosing> = computed(() => {
    const payments = this.payments();
    const income = payments.filter(p => p.isIncome).reduce((sum, p) => sum + p.value, 0);
    const outcome = payments.filter(p => !p.isIncome).reduce((sum, p) => sum + p.value, 0);
    return {
      income,
      outcome,
      total: income - outcome,
    } as IClosing;
  });
  dailyClosing: WritableSignal<IClosing> = signal({

    income: 0,
    outcome: 0,
    total: 0,
  } as IClosing);
  filters: IPaymentFilters = {} as IPaymentFilters;

  paymentMethods = Object.entries(PaymentMethod)
    .filter(([key, value]) => typeof value === 'number')
    .map(([key, value]) => ({ key, value }));

  constructor(private http: HttpClient) {}

  filtersToUrlParams(filters: IPaymentFilters): string {
    const params = new URLSearchParams();
    if (filters.healthPlanId != null) params.append('healthPlanId', filters.healthPlanId);
    if (filters.doctorId != null) params.append('doctorId', filters.doctorId);
    if (filters.paymentMethods != null && filters.paymentMethods.length) {
      filters.paymentMethods.map(method => {
        params.append('paymentMethods', method.toString());
      })
    }
    if (filters.startDate) params.append('startDate', filters.startDate.toISOString());
    if (filters.endDate) params.append('endDate', filters.endDate.toISOString());
    return `?${params.toString()}`;
  }

  setFilters(formValues: FormGroup) {
    this.filters = this.formToFilters(formValues);
    this.getPayments();
  }

  formToFilters(formValues: FormGroup): IPaymentFilters {
    const startDate: Date = new Date(formValues.get('date')?.value[0]);
    startDate.setHours(0, 0, 0, 0);
    let endDate: Date = new Date(formValues.get('date')?.value[1]);
    endDate.setHours(23, 59, 59, 0);
    if (startDate.getTime() === endDate.getTime()) {
      endDate.setDate(endDate.getDate() + 1);
    }
    return {
      startDate,
      endDate,
      healthPlanId: formValues.get('healthPlanId')?.value,
      paymentMethods: formValues.get('paymentMethods')?.value,
      doctorId: formValues.get('doctorId')?.value,
    } as IPaymentFilters;
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
  addFormToPayment(formValues: FormGroup, isIncome: boolean): IPaymentRequest {
    return {
      description: formValues.get('description')?.value,
      value: this.getFieldValueForNumber(formValues.get('value')?.value),
      paymentMethod: formValues.get('paymentMethod')?.value,
      healthPlanId: this.getFieldValueForString(formValues.get('healthPlanId')?.value),
      patientId: this.getFieldValueForString(formValues.get('patientId')?.value),
      doctorId: this.getFieldValueForString(formValues.get('doctorId')?.value),
      isIncome: isIncome
    } as IPaymentRequest
  }

  getPayments(): WritableSignal<IPayment[]> {
    this.http.get<IPayment[]>(`${this._apiUrl}/payment/${this.filtersToUrlParams(this.filters)}`).subscribe(patients => {
      this.payments.set(patients);
    });
    return this.payments;
  }

  getDailyClosing(): WritableSignal<IClosing> {
    this.http.get<IPayment[]>(`${this._apiUrl}/payment`).subscribe(payments => {
      let income = 0;
      let outcome = 0;
      payments.map(payment => {
        if (payment.isIncome) {
          income += payment.value;
        } else {
          outcome += payment.value;
        }
      })
      this.dailyClosing.set({
        income,
        outcome,
        total: income - outcome,
      })
    })
    return this.dailyClosing;

  }

  update() {
    this.getPayments();
    this.getDailyClosing();
  }


  createPayment(formValues: FormGroup, isIncome: boolean): Observable<IPayment> {
    var payment = this.addFormToPayment(formValues, isIncome);
    return this.http.post<IPayment>(`${this._apiUrl}/payment`, payment).pipe(
      tap(payments => {
        this.update();
      })
    );
  }

  updatePayment(formValues: FormGroup, id: string, isIncome: boolean): Observable<IPayment> {
    var payment = this.addFormToPayment(formValues, isIncome);
    payment.id = id;
    return this.http.put<IPayment>(`${this._apiUrl}/payment`, payment).pipe(
      tap(payments => {
        this.update();
      })
    );
  }

  deletePayment(id: string): void {
    this.http.delete<void>(`${this._apiUrl}/payment/${id}`).subscribe(_ => {
      this.update();
    })
  }
}
