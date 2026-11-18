import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowkundaliComponent } from './showkundali.component';

describe('ShowkundaliComponent', () => {
  let component: ShowkundaliComponent;
  let fixture: ComponentFixture<ShowkundaliComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowkundaliComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowkundaliComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
