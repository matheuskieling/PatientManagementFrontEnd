import { Component, WritableSignal } from '@angular/core';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { ButtonWithIcon } from '../button-with-icon/button-with-icon';
import { NzInputDirective } from 'ng-zorro-antd/input';
import { NzOptionComponent, NzSelectComponent } from 'ng-zorro-antd/select';
import { Space } from '../space/space';
import { ICategory, IHealthPlan } from '../../interfaces/IPatient.model';
import { CategoryService } from '../../services/category-service';
import { HealthPlanService } from '../../services/health-plan-service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PatientService } from '../../services/patient-service';
import { MatDialog } from '@angular/material/dialog';
import { NewPatientDialog } from '../new-patient-dialog/new-patient-dialog';
import { NgxMaskDirective } from 'ngx-mask';
import { NewCategoryDialog } from '../new-category-dialog/new-category-dialog';
import { NewHealthPlanDialog } from '../new-health-plan-dialog/new-health-plan-dialog';
import { GreetingService } from '../../services/greeting-service';

@Component({
  selector: 'app-filter',
  imports: [
    NzIconDirective,
    ButtonWithIcon,
    NzInputDirective,
    NzSelectComponent,
    Space,
    NzOptionComponent,
    ReactiveFormsModule,
    NgxMaskDirective
  ],
  templateUrl: './filter.html',
  styleUrl: './filter.scss'
})
export class Filter {
  filterForm: FormGroup;
  greeting: string = "";
  expandedFilter: boolean = false;
  categories: WritableSignal<ICategory[]>;
  healthPlans: WritableSignal<IHealthPlan[]>;

  constructor(private categoryService: CategoryService,
              private healthPlanService: HealthPlanService,
              private fb: FormBuilder,
              private patientService: PatientService,
              private dialog: MatDialog,
              private greetingService: GreetingService
              ) {
    this.filterForm = this.fb.group({
      name: [''],
      birthDate: [null],
      category: [null],
      healthPlan: [null],
      gender: [null],
      phone: [''],
      cpf: [''],
      rg: [''],
      record: [''],
      recordEco: [''],
    });
    this.greeting = greetingService.getGreeting();
    this.categories = this.categoryService.getCategories();
    this.healthPlans = this.healthPlanService.getHealthPlans();
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && this.filterForm.valid) {
      this.submitForm();
    }
  }
  submitForm() {
    if (this.filterForm.valid) {
      this.patientService.page.set(1);
      this.patientService.setFilters(this.filterForm);
    }
  }
  handleNewPatient() {
    this.dialog.open(NewPatientDialog, {
      disableClose: true,
      width: '572px',
    });
  }
  handleNewCategory() {
    this.dialog.open(NewCategoryDialog, {
      width: '572px',
    });
  }
  handleNewHealthPlan() {
    this.dialog.open(NewHealthPlanDialog, {
      width: '572px',
    });
  }
  clearFilters() {
    this.filterForm.reset();
    this.patientService.page.set(1);
    this.patientService.setFilters(this.filterForm);
  }
  filterOption= (input: string, option: any): boolean => {
    return option.nzLabel.toLowerCase().startsWith(input.toLowerCase());
  };
}
