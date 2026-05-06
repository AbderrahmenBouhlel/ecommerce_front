import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step2VariantsCreationComponent } from './step2-variants-creation-component';

describe('Step2VariantsCreationComponent', () => {
  let component: Step2VariantsCreationComponent;
  let fixture: ComponentFixture<Step2VariantsCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Step2VariantsCreationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Step2VariantsCreationComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
