export interface IPatient {
  id: string,
  fileNumber?: number | null,
  birthDate?: Date | null,
  healthPlan?: IHealthPlan | null,
  healthPlanNumber?: string | null,
  gender: string | null,
  name?: string | null,
  cpf?: string | null,
  address?: string | null,
  contacts: IContact[],
  category?: ICategory | null,
  isArchived?: boolean
}

export interface IContact {
  name: string,
  phone?: string,
  patientId: string,
}

export interface ICategory {
  id: string;
  name: string;
  variant: string;
}
export interface IHealthPlan {
  id: string;
  name: string;
}


