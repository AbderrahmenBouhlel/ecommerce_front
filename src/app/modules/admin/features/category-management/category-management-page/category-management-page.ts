import { Component, computed,ViewContainerRef } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { CategoriesStore } from '../../../stores/CategoryManagementStore/categories.store';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GenerateCategoryDialog } from '../components/generate-category-dialog/generate-category-dialog';
import { CategoryCardComponent } from '../components/category-card-component/category-card-component';
import { CommonModule } from '@angular/common';
import { Category } from '../../../stores/CategoryManagementStore/models/Category.model';
import { EditCategoryDialog, EditCategoryDialogResult } from '../components/edit-category-dialog/edit-category-dialog';

@Component({
  selector: 'app-category-management-page',
  imports: [MatIcon, CategoryCardComponent, CommonModule],
  templateUrl: './category-management-page.html',
  styleUrl: './category-management-page.css',
})
export class CategoryManagementPage {

  allCategories$ = computed(() => this.categoriesStore.categoriesState$().items);

  constructor(
    private categoriesStore : CategoriesStore,
    private readonly dialog: MatDialog,
    private readonly snackBar: MatSnackBar,
    private readonly viewContainerRef: ViewContainerRef
  ){}


  openAddCategoryDialog(): void {
    const ref = this.dialog.open(GenerateCategoryDialog ,  {
      viewContainerRef: this.viewContainerRef
    });
    ref.afterClosed().subscribe((result) => {
      if (!result) return;

      this.snackBar.open('Category created successfully', '', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: ['success-snackbar'] // optional styling
      });
    });
  }

  openEditCategoryDialog(category: Category): void {
    const ref = this.dialog.open(EditCategoryDialog, {
      data: category,
      maxHeight: '90vh',
      maxWidth: '95vw',
      viewContainerRef: this.viewContainerRef
    });
  }

}
