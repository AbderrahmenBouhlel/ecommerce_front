import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, signal, WritableSignal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AllowedFilter, Category } from '../../../../stores/CategoryManagementStore/models/Category.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CategoriesStore } from '../../../../stores/CategoryManagementStore/categories.store';
import { Observable } from 'rxjs';
import { AsyncDropdown } from '../../../../../../core/shared/ui/dropdown/async-dropdown/async-dropdown';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationDialog , DeleteConfirmationDialogResult } from '../../../../../../core/shared/ui/dialogs/delete-confimation-dialog/delete-confimation-dialog';


export type EditCategoryDialogResult = {
  action: 'save';
  category: Category;
};

const DISACTIVATE_FILTER_CONFIRMATION_DATA = {
    title: 'Remove Filter',
    message: 'This filter will no longer be available for this category.',
    notes: [
        'New products will not be able to use this filter or its values', 
        'Existing products using this filter will lose all associated values'
    ],
    cancelLabel: 'Cancel',
    confirmLabel: 'Permanently Delete',
}

@Component({
  selector: 'app-edit-category-dialog',
  imports: [CommonModule, ReactiveFormsModule,AsyncDropdown],
  templateUrl: './edit-category-dialog.html',
  styleUrl: './edit-category-dialog.css'
})
export class EditCategoryDialog {

    protected inputCategory:WritableSignal<Category>;
    protected isLoading = signal(false);

    form :FormGroup ;

    constructor(
        private readonly dialogRef: MatDialogRef<EditCategoryDialogResult, EditCategoryDialogResult>,
        @Inject(MAT_DIALOG_DATA) data: Category,
        private readonly snackBar: MatSnackBar,
        private categoriesStore: CategoriesStore,
        private readonly dialog: MatDialog,
    ) {
        this.inputCategory = signal(data);

        this.form = new FormGroup({
            name: new FormControl(this.inputCategory().name),
            description: new FormControl(this.inputCategory().description),
        });
    }


    save(): void {
        if (this.isLoading() || !this.validateForm()) return;

        this.isLoading.set(true);

        this.form.setErrors(null); // Clear previous errors
        const { name, description } = this.form.getRawValue();

        this.categoriesStore.updateCategory(this.inputCategory().id, { name, description }).subscribe({
            next: (updatedCategory) => {
                if (updatedCategory) {
                this.inputCategory.set(updatedCategory);
                this.showSuccess('Category updated successfully');
                }
            },
            error: (err) => {
                console.error('Error updating category:', err);
                this.showError('Failed to update category. Please try again.');
                this.isLoading.set(false);
            },
            complete: () => {
                this.isLoading.set(false);
            }
        });

    }



    protected toggleActive() {
        if (this.isLoading()) return; // Prevent multiple clicks while loading

        this.isLoading.set(true);

        this.categoriesStore.toggleCategoryStatus(this.inputCategory()).subscribe({
            next: (updatedCategory) => {
                if (updatedCategory) {
                    this.inputCategory.set(updatedCategory);
                    this.showSuccess(updatedCategory.isActive ? 'Category activated' : 'Category deactivated');
                }
            },
            error: (err) => {
                console.error('Error deactivating category:', err);
                this.showError('Failed to update category status. Please try again.');
            },
            complete: () => {
                this.isLoading.set(false);
            }
        });
    }




    close(): void {
        this.dialogRef.close();
    }



    protected searchFilters():Observable<AllowedFilter[]> {
        const excludedIds = this.inputCategory().allowedFilters.map(filter => filter.id);
        return this.categoriesStore.searchFilters("", excludedIds);
    }

    protected enableFilter(filter: AllowedFilter) {
        if (this.isLoading()) return;

        this.isLoading.set(true);
        this.categoriesStore.enableCategoryFilter(this.inputCategory().id, filter).subscribe({
            next: (updatedCategory) => {
                if (updatedCategory) {
                    this.inputCategory.set(updatedCategory);
                    this.showSuccess('Filter enabled for category');
                }
            },
            error: (err) => {
                console.error('Error enabling filter for category:', err);
                this.showError('Failed to enable filter. Please try again.');
                this.isLoading.set(false);
            },
            complete: () => {
                this.isLoading.set(false);
            }
        });
    }

    protected disableFilter(filterId: number): void {
        if (this.isLoading()) return;
        const ref = this.dialog.open(DeleteConfirmationDialog, {
            data: DISACTIVATE_FILTER_CONFIRMATION_DATA,
            maxHeight: '90vh',
            maxWidth: '90vw',
        })
        ref.afterClosed().subscribe((result: DeleteConfirmationDialogResult)=>{
            if (!result?.confirmed) return;
            this.isLoading.set(true);
            this.categoriesStore.disableCategoryFilter(this.inputCategory().id, filterId).subscribe({
                next: (updatedCategory) => {
                    if (updatedCategory) {
                        this.inputCategory.set(updatedCategory);
                        this.showSuccess('Filter disabled for category');
                    }
                },
                error: (err) => {
                    console.error('Error disabling filter for category:', err);
                    this.showError('Failed to disable filter. Please try again.');
                    this.isLoading.set(false);
                },
                complete: () => {
                    this.isLoading.set(false);
                }
            });
        })
        
    }
    
    private validateForm(): boolean {
        const name = this.form.get('name')?.value.trim();
        const description = this.form.get('description')?.value.trim();

        if (!name && !description) {
            this.form.setErrors({ required: true });
            return false;
        }
        if (name === this.inputCategory().name && description === this.inputCategory().description) {
            this.form.setErrors({ noChange: true });
            return false;
        }
        return true;
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

}
