import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step1BasicInfoComponent } from './step1-basic-info-component';

describe('Step1BasicInfoComponent', () => {
  let component: Step1BasicInfoComponent;
  let fixture: ComponentFixture<Step1BasicInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Step1BasicInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Step1BasicInfoComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
