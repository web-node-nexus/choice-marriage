import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindmatchesComponent } from './findmatches.component';

describe('FindmatchesComponent', () => {
  let component: FindmatchesComponent;
  let fixture: ComponentFixture<FindmatchesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FindmatchesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FindmatchesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
