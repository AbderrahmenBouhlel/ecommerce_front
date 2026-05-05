import { CommonModule } from '@angular/common';
import {  Component, signal, Inject, WritableSignal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Filter, FilterValue } from '../../../../stores/FilterManagementStore/models/filter.model';
import { MatSnackBar } from '@angular/material/snack-bar';

import { FormControl , FormGroup } from '@angular/forms';
import { FiltersStore } from '../../../../stores/FilterManagementStore/filters.store';
import { FilterValueItemComponent } from '../filter-value-item-component/filter-value-item-component';
import { MatDialog } from '@angular/material/dialog';


import { FilterValueAlreadyExistsException } from '../../../../stores/FilterManagementStore/apis/models/filter-value/createFilterValue.api';

import { DeleteConfirmationDialog , DeleteConfirmationDialogResult } from '../../../../../../core/shared/ui/dialogs/delete-confimation-dialog/delete-confimation-dialog';


import { ApiException } from '../../../../../../core/shared/api/api.responseTypes';




type EditFilterDialogResult = {
  action: 'save';
  filter: Filter;
};




@Component({
  selector: 'app-edit-filter-dialog',
  standalone: true,
  styleUrls: ['./edit-filter-dialog.css'] ,
  imports: [CommonModule, FormsModule , ReactiveFormsModule, FilterValueItemComponent],
  templateUrl: './edit-filter-dialog.html',
})
export class EditFilterDialog {

  protected inputFilter: WritableSignal<Filter>;
  protected isLoading = signal(false);

  protected addValueFormVisible = signal(false);

  form :FormGroup ;
  protected newFilterValueName = signal('');

  constructor(
    private readonly dialogRef: MatDialogRef<EditFilterDialog, EditFilterDialogResult>,
    @Inject(MAT_DIALOG_DATA) data: Filter,
    private readonly filtersStore: FiltersStore,
    private readonly snackBar: MatSnackBar,
    private readonly dialog: MatDialog
  ) {
    this.inputFilter = signal(data);

    this.form = new FormGroup({
      name: new FormControl(this.inputFilter().name),
      description: new FormControl(this.inputFilter().description),
    });
  }

  
  protected save() {
    if (this.isLoading() || !this.validateForm()) return;

    this.isLoading.set(true);


    this.form.setErrors(null); // Clear previous errors
    const { name, description } = this.form.getRawValue();
    this.filtersStore.updateFilter(this.inputFilter().id, { name, description }).subscribe({
      next: (updatedFilter) => {
        if (updatedFilter) {
          this.inputFilter.set(updatedFilter);
          this.showSuccess('Filter updated successfully');
        }
      },
      error: (err) => {
        console.error('Error updating filter:', err);
        this.showError('Failed to update filter. Please try again.');
      },
      complete: () => {
        this.isLoading.set(false);
      }
    });
  }


  protected toggleActive() {
    if (this.isLoading()) return; // Prevent multiple clicks while loading

    this.isLoading.set(true);
    this.filtersStore.toggleFilterStatus(this.inputFilter()).subscribe({
      next: (updatedFilter) => {
        if (updatedFilter) {
          this.inputFilter.set(updatedFilter);
          this.showSuccess(updatedFilter.isActive ? 'Filter activated' : 'Filter deactivated');
        }
      },
      error: (err) => {
        console.error('Error deactivating filter:', err);
        this.showError('Failed to update filter status. Please try again.');
      },
      complete: () => {
        this.isLoading.set(false);
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }

  protected onFilterValueToggleEvent(filterValue: FilterValue): void {

    this.filtersStore.toggleFilterValueStatus(filterValue).subscribe({
      next: (updatedValue) => {
        if (updatedValue) {
          const nextValues = this.inputFilter().values.map((value) => {
            if (value.id !== filterValue.id) {
              return value;
            }
            return {
              ...value,
              isActive: !value.isActive,
            };
          });
          this.inputFilter.update((filter) => ({
            ...filter,
            values: nextValues,
          }));

          this.showSuccess(`Value "${filterValue.name}" ${updatedValue.isActive ? 'activated' : 'deactivated'}`);
        }
      },
      error: (err) => {
        console.error('Error toggling filter value status:', err);
        this.showError('Failed to update filter value status. Please try again.');
      }
    })
    
  }

  protected onFilterValueDeleteEvent(filterValue: FilterValue): void {

    const ref = this.dialog.open(DeleteConfirmationDialog, {
      data: {
        title: 'Permanently Delete Filter Value',
        message: 'This will permanently delete this filter value. This action cannot be undone and might affect products that currently use this value.',
        note: 'Note: If you want to temporarily disable this value, use the toggle switch instead of deleting it.',
        cancelLabel: 'Cancel',
        confirmLabel: 'Permanently Delete',
      },
      maxHeight: '90vh',
      maxWidth: '90vw',
    })

    ref.afterClosed().subscribe((result: DeleteConfirmationDialogResult)=>{
      if (!result?.confirmed) return;
      this.filtersStore.deleteFilterValue(filterValue.id).subscribe({
        next: () => {
          const nextValues = this.inputFilter().values.filter((value) => value.id !== filterValue.id);
          this.inputFilter.update((filter) => ({
            ...filter,
            values: nextValues,
          }));

          this.showSuccess(`Value "${filterValue.name}" removed`);
        },
        error: (err) => {
          console.error('Error deleting filter value:', err);
          this.showError('Failed to delete filter value. Please try again.');
        }
      })
    })
  }

  private showError(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 4000,
      panelClass: ['error-snackbar'] // optional styling
    });
  }
  private showSuccess(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar'] ,// optional styling
    });
  }

  private validateForm(): boolean {
    const name = this.form.get('name')?.value.trim();
    const description = this.form.get('description')?.value.trim();

    if (!name && !description) {
      this.form.setErrors({ required: true });
      return false;
    }
    if (name === this.inputFilter().name && description === this.inputFilter().description) {
      this.form.setErrors({ noChange: true });
      return false;
    }
    return true;
  }


  createFilterValue(): void {
    const name = this.newFilterValueName().trim();
    if (!name) {
      this.showError('Value name cannot be empty');
      return;
    }
    this.filtersStore.createFilterValue(this.inputFilter().id, name, '').subscribe({
      next: (newValue) => {
        if (newValue) {
          this.inputFilter.update((filter) => ({
            ...filter,
            values: [...filter.values, newValue],
          }));
          this.newFilterValueName.set('');
          this.toggleAddValueFormVisibility();
          this.showSuccess(`Value "${newValue.name}" created`);
        }
      },
      error: (err: ApiException) => {
        if (err instanceof FilterValueAlreadyExistsException){
          this.showError('A value with this name already exists. Please choose a different name.');
          return;
        }
        console.error('Error creating filter value:', err);
        this.showError('Failed to create filter value. Please try again.');
      }
    })
  }

  protected toggleAddValueFormVisibility() {
    this.addValueFormVisible.update((visible) => !visible);
  }


}