import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchofthedayComponent } from './matchoftheday.component';

describe('MatchofthedayComponent', () => {
  let component: MatchofthedayComponent;
  let fixture: ComponentFixture<MatchofthedayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatchofthedayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatchofthedayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
