import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShortlistProfileListComponent } from './shortlist-profile-list.component';

describe('ShortlistProfileListComponent', () => {
  let component: ShortlistProfileListComponent;
  let fixture: ComponentFixture<ShortlistProfileListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShortlistProfileListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShortlistProfileListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
