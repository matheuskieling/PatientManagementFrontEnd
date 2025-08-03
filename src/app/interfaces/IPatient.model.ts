export interface IPatient {
  id: string,
  fileNumber?: number | null,
  birthDate?: Date | null,
  healthPlan?: string | null,
  healthPlanNumber?: string | null,
  name?: string | null,
  cpf?: string | null,
  address?: string | null,
  contacts: IContact[],
  responsible?: string | null,
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
}


