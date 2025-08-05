import { Component } from '@angular/core';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { ButtonWithIcon } from '../button-with-icon/button-with-icon';
import { NzInputDirective } from 'ng-zorro-antd/input';
import { NzOptionComponent, NzSelectComponent } from 'ng-zorro-antd/select';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { Space } from '../space/space';
import { ICategory, IHealthPlan } from '../../interfaces/IPatient.model';
import { CategoryService } from '../../services/category-service';
import { HealthPlanService } from '../../services/health-plan-service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PatientService } from '../../services/patient-service';

@Component({
  selector: 'app-filter',
  imports: [
    NzIconDirective,
    ButtonWithIcon,
    NzInputDirective,
    NzSelectComponent,
    NzDatePickerComponent,
    Space,
    NzOptionComponent,
    ReactiveFormsModule
  ],
  templateUrl: './filter.html',
  styleUrl: './filter.scss'
})
export class Filter {
  filterForm: FormGroup;
  greeting: string = "";
  expandedFilter: boolean = false;
  categories: ICategory[] = [];
  healthPlans: IHealthPlan[] = [];

  constructor(private categoryService: CategoryService,
              private healthPlanService: HealthPlanService,
              private fb: FormBuilder,
              private patientService: PatientService) {
    this.filterForm = this.fb.group({
      name: [''],
      birthDate: [null],
      category: [null],
      healthPlan: [null],
      gender: [null],
      phone: [''],
      cpf: [''],
      record: [''],
      archived: [null],
    });
  }

  ngOnInit() {
    const now = new Date().getHours();
    if (now < 12) {
      this.greeting = "Bom dia!";
    } else if (now < 18) {
      this.greeting = "Boa tarde!";
    } else {
      this.greeting = "Boa noite!";
    }
    this.categoryService.getCategories().subscribe(categories => {
      this.categories = categories;
    })
    this.healthPlanService.getHealthPlans().subscribe(plan => {
      this.healthPlans = plan
    })
  }

  submitForm() {
    if (this.filterForm.valid) {
      this.patientService.setFilters(this.filterForm);
    }
  }
}
