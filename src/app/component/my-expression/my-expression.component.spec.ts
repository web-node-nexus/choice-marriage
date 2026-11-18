import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyExpressionComponent } from './my-expression.component';

describe('MyExpressionComponent', () => {
  let component: MyExpressionComponent;
  let fixture: ComponentFixture<MyExpressionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyExpressionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyExpressionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
