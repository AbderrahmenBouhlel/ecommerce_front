import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { EditCategoryDialog } from './edit-category-dialog';

describe('EditCategoryDialog', () => {
  let component: EditCategoryDialog;
  let fixture: ComponentFixture<EditCategoryDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditCategoryDialog],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            id: 1,
            name: 'Pantalons',
            gender: 'MALE',
            slug: 'pantalons',
            description: 'Category for pants',
            isActive: true,
            createdAt: '2026-04-21T00:00:00Z',
            allowedFilters: [],
          },
        },
        {
          provide: MatDialogRef,
          useValue: {
            close: () => undefined,
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditCategoryDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
