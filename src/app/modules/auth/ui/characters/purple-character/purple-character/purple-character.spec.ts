import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurpleCharacter } from './purple-character';

describe('PurpleCharacter', () => {
  let component: PurpleCharacter;
  let fixture: ComponentFixture<PurpleCharacter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurpleCharacter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurpleCharacter);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
