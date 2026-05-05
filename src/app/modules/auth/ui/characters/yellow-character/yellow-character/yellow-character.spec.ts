import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YellowCharacter } from './yellow-character';

describe('YellowCharacter', () => {
  let component: YellowCharacter;
  let fixture: ComponentFixture<YellowCharacter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YellowCharacter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YellowCharacter);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
