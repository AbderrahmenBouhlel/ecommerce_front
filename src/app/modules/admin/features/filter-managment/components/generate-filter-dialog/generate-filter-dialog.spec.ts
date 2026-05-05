import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateFilterDialog } from './generate-filter-dialog';

describe('GenerateFilterDialog', () => {
  let component: GenerateFilterDialog;
  let fixture: ComponentFixture<GenerateFilterDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenerateFilterDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerateFilterDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
