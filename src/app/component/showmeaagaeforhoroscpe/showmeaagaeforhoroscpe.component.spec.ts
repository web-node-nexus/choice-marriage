import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowmeaagaeforhoroscpeComponent } from './showmeaagaeforhoroscpe.component';

describe('ShowmeaagaeforhoroscpeComponent', () => {
  let component: ShowmeaagaeforhoroscpeComponent;
  let fixture: ComponentFixture<ShowmeaagaeforhoroscpeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowmeaagaeforhoroscpeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowmeaagaeforhoroscpeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
