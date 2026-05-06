import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step3SkusCreationComponent } from './step3-skus-creation-component';

describe('Step3SkusCreationComponent', () => {
  let component: Step3SkusCreationComponent;
  let fixture: ComponentFixture<Step3SkusCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Step3SkusCreationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Step3SkusCreationComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
