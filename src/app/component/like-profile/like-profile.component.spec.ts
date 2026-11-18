import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LikeProfileComponent } from './like-profile.component';

describe('LikeProfileComponent', () => {
  let component: LikeProfileComponent;
  let fixture: ComponentFixture<LikeProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LikeProfileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LikeProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
