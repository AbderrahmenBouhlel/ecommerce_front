import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';

import { GenerateCategoryDialog } from './generate-category-dialog';
import { CategoriesStore } from '../../../../stores/CategoryManagementStore/categories.store';

const categoriesStoreMock: Pick<CategoriesStore, 'createCategory'> = {
  createCategory: () => of({} as never),
};

const dialogRefMock: Pick<MatDialogRef<GenerateCategoryDialog>, 'close'> = {
  close: () => undefined,
};

describe('GenerateCategoryDialog', () => {
  let component: GenerateCategoryDialog;
  let fixture: ComponentFixture<GenerateCategoryDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenerateCategoryDialog],
      providers: [
        { provide: CategoriesStore, useValue: categoriesStoreMock },
        { provide: MatDialogRef, useValue: dialogRefMock },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerateCategoryDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
