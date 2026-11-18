import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadPaymentSlipComponent } from './upload-payment-slip.component';

describe('UploadPaymentSlipComponent', () => {
  let component: UploadPaymentSlipComponent;
  let fixture: ComponentFixture<UploadPaymentSlipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadPaymentSlipComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadPaymentSlipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
