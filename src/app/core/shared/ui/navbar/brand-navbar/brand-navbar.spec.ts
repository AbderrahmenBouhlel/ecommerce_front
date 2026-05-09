import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandNavbar } from './brand-navbar';

describe('BrandNavbar', () => {
  let component: BrandNavbar;
  let fixture: ComponentFixture<BrandNavbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrandNavbar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrandNavbar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
