import { Component, computed,ViewContainerRef } from '@angular/core';
import { FiltersStore } from '../../../stores/FilterManagementStore/filters.store';
import { FilterCardComponent } from '../components/filter-card-component/filter-card-component';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { GenerateFilterDialog } from '../components/generate-filter-dialog/generate-filter-dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Filter } from '../../../stores/FilterManagementStore/models/filter.model';
import { EditFilterDialog } from '../components/edit-filter-dialog/edit-filter-dialog';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-filter-management-page',
  imports: [FilterCardComponent, MatIconModule, CommonModule],
  templateUrl: './filter-management-page.html',
  styleUrl: './filter-management-page.css',
})
export class FilterManagementPage {


  constructor(
    private readonly filtersStore: FiltersStore,
    private readonly dialog: MatDialog,
    private readonly snackBar: MatSnackBar,
    private readonly viewContainerRef: ViewContainerRef
  ) {
  }

  allFilters$ = computed(() =>  this.filtersStore.filtersState$().items);


  openAddFilterDialog() {
    // you are telling Angular Material:
    // “Attach this dialog to my component’s injector tree”
    const ref  = this.dialog.open(GenerateFilterDialog, {
      viewContainerRef: this.viewContainerRef
    });
    ref.afterClosed().subscribe((result) => {
      if (!result) return;

      this.snackBar.open('Filter created successfully', '', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: ['success-snackbar'] // optional styling
      });
    });
  }

  openEditFilterDialog(filter: Filter) {
    const ref = this.dialog.open(EditFilterDialog, {
      data: filter,
      maxWidth: '95vw',
      viewContainerRef: this.viewContainerRef
    });
    ref.afterClosed().subscribe((result) => {
      if (!result) return;

      this.snackBar.open('Filter updated successfully', '', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: ['success-snackbar'] // optional styling
      });
    });

  }

}
