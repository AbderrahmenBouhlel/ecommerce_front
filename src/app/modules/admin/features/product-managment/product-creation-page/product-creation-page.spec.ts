import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCreationPage } from './product-creation-page';

describe('ProductCreationPage', () => {
  let component: ProductCreationPage;
  let fixture: ComponentFixture<ProductCreationPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCreationPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductCreationPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
