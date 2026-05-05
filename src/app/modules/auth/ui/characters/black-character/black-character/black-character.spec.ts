import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlackCharacter } from '../black-character';

describe('BlackCharacter', () => {
  let component: BlackCharacter;
  let fixture: ComponentFixture<BlackCharacter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlackCharacter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlackCharacter);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
