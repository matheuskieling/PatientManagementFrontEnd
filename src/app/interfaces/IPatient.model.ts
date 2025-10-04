export interface IPatient {
  id: string,
  fileNumber?: number | null,
  fileNumberEco?: number | null,
  birthDate?: string | null,
  healthPlan?: IHealthPlan | null,
  healthPlanNumber?: string | null,
  phone?: string | null,
  gender: string | null,
  name?: string | null,
  cpf?: string | null,
  rg?: string | null,
  city?: string | null,
  street?: string | null,
  contacts: IContact[],
  category?: ICategory | null,
  isArchived?: boolean
}

export interface IPatientRequest {
  id?: string,
  fileNumber?: number | null,
  fileNumberEco?: number | null,
  birthDate?: Date | null,
  healthPlanName?: string | null,
  healthPlanNumber?: string | null,
  gender: string | null,
  name?: string | null,
  cpf?: string | null,
  rg?: string | null,
  phone?: string | null,
  city?: string | null,
  street?: string | null,
  contacts: IContact[],
  categoryName?: ICategory | null,
  isArchived?: boolean
}

export interface IContact {
  name?: string,
  phone?: string,
  patientId: string,
}

export interface IContactRequest {
  name?: string | null,
  phone?: string | null,
}

export interface ICategory {
  id: string | null;
  name: string | null;
  variant?: string | null;
}

export interface ICategoryRequest {
  name: string | null;
  variant?: string | null;
}
export interface IHealthPlan {
  id: string;
  name: string;
}

export interface IHealthPlanRequest {
  name: string;
}

export interface IDoctor {
  id: string;
  name: string;
}

export interface IDoctorRequest {
  name: string;
}

export interface IValidationResults {
  name: IValidationField,
  cpf: IValidationField,
  rg: IValidationField,
  fileNumber: IValidationField,
  fileNumberEco: IValidationField,
}

export interface IValidationField {
  isValid: boolean,
  errorMessage: string
}

export interface INextNumbersResponse {
  fileNumber: number,
  fileNumberEco: number,
}

