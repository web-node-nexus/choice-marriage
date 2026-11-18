import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LockprofilealertComponent } from './lockprofilealert.component';

describe('LockprofilealertComponent', () => {
  let component: LockprofilealertComponent;
  let fixture: ComponentFixture<LockprofilealertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LockprofilealertComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LockprofilealertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
