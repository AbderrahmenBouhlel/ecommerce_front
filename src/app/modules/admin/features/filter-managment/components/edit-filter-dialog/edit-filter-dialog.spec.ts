import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { EditFilterDialog } from './edit-filter-dialog';
import { FiltersStore } from '../../stores/FilterManagementStore/filters.store';

describe('EditFilterDialog', () => {
  let component: EditFilterDialog;
  let fixture: ComponentFixture<EditFilterDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditFilterDialog],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            id: 1,
            name: 'TYPE',
            slug: 'type',
            description: 'Product type',
            isActive: true,
            createdAt: '2026-04-21T00:00:00Z',
            values: [],
          },
        },
        {
          provide: MatDialogRef,
          useValue: {
            close: () => undefined,
          },
        },
        {
          provide: FiltersStore,
          useValue: {
            updateFilter: () => of(undefined),
            toggleFilterStatus: () => of(undefined),
          },
        },
        {
          provide: MatSnackBar,
          useValue: {
            open: () => undefined,
          },
        },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditFilterDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
