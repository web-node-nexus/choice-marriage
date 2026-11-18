import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchesOptionHolderComponent } from './matches-option-holder.component';

describe('MatchesOptionHolderComponent', () => {
  let component: MatchesOptionHolderComponent;
  let fixture: ComponentFixture<MatchesOptionHolderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatchesOptionHolderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatchesOptionHolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
