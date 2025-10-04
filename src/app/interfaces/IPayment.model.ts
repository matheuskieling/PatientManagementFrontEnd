import { IDoctor, IHealthPlan, IPatient } from './IPatient.model';
import { PaymentMethod } from '../../enums/enums';

export interface IPayment {
  id: string;
  description: string;
  healthPlan?: IHealthPlan | null;
  date: string;
  paymentMethod?: PaymentMethod;
  value: number;
  patient?: IPatient | null;
  isIncome: boolean;
  doctor?: IDoctor | null;
}

export interface IClosing {
  income: number;
  outcome: number;
  total: number;
}

export interface IPaymentRequest {
  id?: string | null
  description: string;
  healthPlanId?: string | null;
  paymentMethod: PaymentMethod;
  value: number;
  patientId?: string | null;
  isIncome: boolean;
  doctorId?: string | null;
}
