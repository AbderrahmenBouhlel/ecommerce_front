import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterManagementPage } from './filter-management-page';

describe('FilterManagementPage', () => {
  let component: FilterManagementPage;
  let fixture: ComponentFixture<FilterManagementPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterManagementPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterManagementPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
