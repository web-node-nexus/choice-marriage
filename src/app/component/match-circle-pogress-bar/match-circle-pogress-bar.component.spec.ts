import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchCirclePogressBarComponent } from './match-circle-pogress-bar.component';

describe('MatchCirclePogressBarComponent', () => {
  let component: MatchCirclePogressBarComponent;
  let fixture: ComponentFixture<MatchCirclePogressBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatchCirclePogressBarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatchCirclePogressBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
