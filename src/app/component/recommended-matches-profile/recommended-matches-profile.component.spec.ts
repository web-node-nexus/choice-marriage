import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecommendedMatchesProfileComponent } from './recommended-matches-profile.component';

describe('RecommendedMatchesProfileComponent', () => {
  let component: RecommendedMatchesProfileComponent;
  let fixture: ComponentFixture<RecommendedMatchesProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecommendedMatchesProfileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecommendedMatchesProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
