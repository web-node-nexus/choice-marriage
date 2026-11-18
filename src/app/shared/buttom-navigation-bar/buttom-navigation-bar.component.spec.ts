import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtomNavigationBarComponent } from './buttom-navigation-bar.component';

describe('ButtomNavigationBarComponent', () => {
  let component: ButtomNavigationBarComponent;
  let fixture: ComponentFixture<ButtomNavigationBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ButtomNavigationBarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ButtomNavigationBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
