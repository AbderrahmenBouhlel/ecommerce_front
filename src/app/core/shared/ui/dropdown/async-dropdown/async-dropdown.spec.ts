import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsyncDropdown } from './async-dropdown';

describe('AsyncDropdown', () => {
  let component: AsyncDropdown;
  let fixture: ComponentFixture<AsyncDropdown>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsyncDropdown]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsyncDropdown);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
