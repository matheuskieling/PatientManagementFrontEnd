import { Component, WritableSignal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ICategory, ICategoryRequest } from '../../interfaces/IPatient.model';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { ButtonWithIcon } from '../button-with-icon/button-with-icon';
import { NzInputDirective } from 'ng-zorro-antd/input';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../../services/category-service';
import { NgClass } from '@angular/common';
import { ConfirmDialog } from '../confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-new-category-dialog',
  imports: [
    ButtonWithIcon,
    NzInputDirective,
    ReactiveFormsModule,
    NzButtonComponent,
    NgClass
  ],
  templateUrl: './new-category-dialog.html',
  styleUrl: './new-category-dialog.scss'
})
export class NewCategoryDialog {
  addCategoryForm: FormGroup;
  editCategoryForm: FormGroup;
  isEditing: boolean = false;
  editingCategoryId: string | null | undefined = null;
  categories: WritableSignal<ICategory[]>;
  constructor(private fb: FormBuilder, private categoryService: CategoryService, private dialog: MatDialog) {
    this.addCategoryForm = this.fb.group({
      name: ['', Validators.required],
    })
    this.editCategoryForm = this.fb.group({
      name: ['', Validators.required],
    })
    this.categories = this.categoryService.getCategories();
  }
  createCategory() {
    if (this.addCategoryForm.invalid) {
      return;
    }
    const category: ICategoryRequest = {
      name: this.addCategoryForm.value.name,
      variant: 'pink'
    }
    this.categoryService.createCategory(category)
    this.addCategoryForm.reset();
  }
  editCategory(category: ICategory) {
    if (this.isEditing) {
      return;
    }
    this.isEditing = true;
    this.editingCategoryId = category.id;
    this.editCategoryForm.patchValue({
      name: category.name,
    });
  }
  saveEditedCategory(category: ICategory) {
    if (this.editCategoryForm.invalid) {
      return;
    }
    const updatedCategory: ICategory = {
      ...category,
      name: this.editCategoryForm.value.name
    };
    this.categoryService.updateCategory(updatedCategory)
    this.editCategoryForm.reset();
    this.editingCategoryId = null;
    this.isEditing = false;
  }

  deleteCategory(category: ICategory) {
    if (this.isEditing) {
      return;
    }
    this.categoryService.checkCategoryDelete(category).subscribe(result => {
      const subtitle = result > 0 ? `Essa categoria é usada em ${result} paciente${result > 1 ? 's' : ''}. Se você excluir esta categoria, ela será removida de todos os pacientes.` : 'A ação não pode ser desfeita.';
      const dialogRef = this.dialog.open(ConfirmDialog, {
        width: '416px',
        data: {
          title: 'Você tem certeza que deseja excluir esta categoria?',
          subtitle: subtitle,
          confirmText: 'Deletar',
          cancelText: 'Cancelar'
        }
      }).afterClosed().subscribe(result => {
        if (!result) {
          return;
        }
        this.categoryService.deleteCategory(category);
      });
    })
  }
}
