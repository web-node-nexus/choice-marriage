import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IgnoreProfileListComponent } from './ignore-profile-list.component';

describe('IgnoreProfileListComponent', () => {
  let component: IgnoreProfileListComponent;
  let fixture: ComponentFixture<IgnoreProfileListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IgnoreProfileListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IgnoreProfileListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
