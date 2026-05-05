import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';
import { CategoriesStore } from '../../../../stores/CategoryManagementStore/categories.store';
import { Category, CategoryGender } from '../../../../stores/CategoryManagementStore/models/Category.model';
import {
  ApiException,
  BadRequestException,
  CategoryNameAlreadyExistsException,
  InternalServerException,
  NetworkException,
  ServiceUnavailableError,
  SessionInvalidException,
  UnauthorizedActionError,
  UnknownApiException,
} from '../../../../../../core/shared/api/api.responseTypes';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-generate-category-dialog',
  imports: [CommonModule, FormsModule],
  templateUrl: './generate-category-dialog.html',
  styleUrl: './generate-category-dialog.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenerateCategoryDialog {
  private readonly categoriesStore = inject(CategoriesStore);
  private readonly dialogRef = inject(MatDialogRef<GenerateCategoryDialog, Category>);

  name = signal('');
  description = signal('');
  selectedGender = signal<CategoryGender>('MALE');

  readonly genderOptions: readonly CategoryGender[] = ['MALE', 'FEMALE'];

  isSubmitting = signal(false);

  displayServerError = signal('');
  displayedNameError = signal('');

  isValid = computed(() => {
    return this.getNameError() === '';
  });

  onNameChange(value: string) {
    this.clearDisplayedErrors();
    this.name.set(value);
  }

  onDescriptionChange(value: string): void {
    this.description.set(value);
  }

  onGenderChange(value: string): void {
    if (value !== 'MALE' && value !== 'FEMALE') {
      return;
    }

    this.clearDisplayedErrors();
    this.selectedGender.set(value);
  }

  onNameBlur() {
    const error = this.getNameError();
    this.displayedNameError.set(error);
  }

  close() {
    if (this.isSubmitting()) return;
    this.dialogRef.close();
  }

  createCategory() {
    if (this.isSubmitting()) return;
    if (!this.isValid()) return;

    this.clearDisplayedErrors();
    this.isSubmitting.set(true);

    const name = this.name().trim();
    const description = this.description().trim();
    const gender = this.selectedGender();

    this.categoriesStore.createCategory(name, gender, description).subscribe({
      next: (newCategory: Category) => {
        this.dialogRef.close(newCategory);
      },
      error: (err: ApiException) => {
        this.handleCreateCategoryError(err);
      }
    });
  }


  private handleCreateCategoryError(err: ApiException): void {
    this.isSubmitting.set(false);

    if (err instanceof CategoryNameAlreadyExistsException) {
      this.displayServerError.set('A category with this name already exists. Please choose a different name.');
      return;
    }

    if (err instanceof BadRequestException) {
      this.displayServerError.set('The category details are invalid. Please review the form and try again.');
      return;
    }

    if (err instanceof SessionInvalidException) {
      this.displayServerError.set('Your session has expired. Please sign in again and retry.');
      return;
    }

    if (err instanceof UnauthorizedActionError) {
      this.displayServerError.set('You are not allowed to create categories.');
      return;
    }

    if (err instanceof ServiceUnavailableError) {
      this.displayServerError.set('Service is temporarily unavailable. Please try again in a moment.');
      return;
    }

    if (err instanceof InternalServerException) {
      this.displayServerError.set('A server error occurred while creating the category. Please try again later.');
      return;
    }

    if (err instanceof NetworkException) {
      this.displayServerError.set('Network error. Please check your connection and try again.');
      return;
    }

    if (err instanceof UnknownApiException) {
      this.displayServerError.set('Unexpected server response. Please try again.');
      return;
    }

    this.displayServerError.set(err.message || 'Failed to create category.');
  }


  private getNameError(): string {
    const nameValue = this.name().trim();
    if (nameValue.length === 0) {
      return 'Name is required';
    }
    else if (nameValue.length < 3) {
      return 'Name must be at least 3 characters';
    }
    else {
      return '';
    }
  }


  private clearDisplayedErrors(): void {
    this.displayedNameError.set('');
    this.displayServerError.set('');
  }
}
