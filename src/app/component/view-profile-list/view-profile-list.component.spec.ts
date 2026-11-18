import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewProfileListComponent } from './view-profile-list.component';

describe('ViewProfileListComponent', () => {
  let component: ViewProfileListComponent;
  let fixture: ComponentFixture<ViewProfileListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewProfileListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewProfileListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
