import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step4FilterValuesAttachementComponent } from './step4-filter-values-attachement-component';

describe('Step4FilterValuesAttachementComponent', () => {
  let component: Step4FilterValuesAttachementComponent;
  let fixture: ComponentFixture<Step4FilterValuesAttachementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Step4FilterValuesAttachementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Step4FilterValuesAttachementComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
