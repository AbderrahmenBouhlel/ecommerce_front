import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryManagementPage } from './category-management-page';

describe('CategoryManagementPage', () => {
  let component: CategoryManagementPage;
  let fixture: ComponentFixture<CategoryManagementPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryManagementPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryManagementPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
