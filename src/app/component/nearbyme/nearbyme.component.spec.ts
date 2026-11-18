import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NearbymeComponent } from './nearbyme.component';

describe('NearbymeComponent', () => {
  let component: NearbymeComponent;
  let fixture: ComponentFixture<NearbymeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NearbymeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NearbymeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
