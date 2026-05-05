import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductManagementPage } from './product-management-page';

describe('ProductManagementPage', () => {
  let component: ProductManagementPage;
  let fixture: ComponentFixture<ProductManagementPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductManagementPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductManagementPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
