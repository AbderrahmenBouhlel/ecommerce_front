import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { FiltersStore } from '../../../../stores/FilterManagementStore/filters.store';
import { Filter } from '../../../../stores/FilterManagementStore/models/filter.model';
import {
  ApiException,
  BadRequestException,
  InternalServerException,
  NetworkException,
  ServiceUnavailableError,
  SessionInvalidException,
  UnauthorizedActionError,
  UnknownApiException,
} from '../../../../../../core/shared/api/api.responseTypes';
import { FilterNameAlreadyExistsException } from '../../../../../../core/shared/api/api.responseTypes';
import { FormsModule } from '@angular/forms';
import { computed } from '@angular/core';




@Component({
  selector: 'app-generate-filter-dialog',
  imports: [CommonModule, ReactiveFormsModule,FormsModule],
  templateUrl: './generate-filter-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenerateFilterDialog {

  // 🔹 state
  name = signal('');
  description = signal('');

  
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
  onNameBlur(){
    const error = this.getNameError();
    this.displayedNameError.set(error);
  }

  constructor(
    private readonly filtersStore: FiltersStore,
    private readonly dialogRef: MatDialogRef<GenerateFilterDialog, Filter>
  ) {}


  close() {
    if (this.isSubmitting()) return;
    this.dialogRef.close();
  }

  protected createFilter() {
    if (this.isSubmitting()) return;
    if (!this.isValid()) return;

    this.clearDisplayedErrors();
    this.isSubmitting.set(true);

    const name = this.name().trim();
    const description = this.description().trim();

    this.filtersStore.createFilter(name, description).subscribe({
      next: (newFilter: Filter) => {
        this.dialogRef.close(newFilter);
      },
      error: (err: ApiException) => {
        this.handleCreateFilterError(err);
      }
    });
  }


  private handleCreateFilterError(err: ApiException): void {
    this.isSubmitting.set(false);

    if (err instanceof FilterNameAlreadyExistsException) {
      console.warn('Filter name already exists:', err);
      this.displayServerError.set('A filter with this name already exists. Please choose a different name.');
      return;
    }

    if (err instanceof BadRequestException) {
      this.displayServerError.set('The request is invalid. Please review filter name and description.');
      return;
    }

    if (err instanceof SessionInvalidException) {
      this.displayServerError.set('Your session is invalid or expired. Please sign in again.');
      return;
    }

    if (err instanceof UnauthorizedActionError) {
      this.displayServerError.set('You are not allowed to create filters.');
      return;
    }

    if (err instanceof ServiceUnavailableError) {
      this.displayServerError.set('Service is temporarily unavailable. Please try again shortly.');
      return;
    }

    if (err instanceof InternalServerException) {
      this.displayServerError.set('An internal server error occurred. Please try again later.') ;
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

    this.displayServerError.set(err.message || 'Failed to create filter.');
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
