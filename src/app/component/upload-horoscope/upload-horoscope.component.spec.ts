import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadHoroscopeComponent } from './upload-horoscope.component';

describe('UploadHoroscopeComponent', () => {
  let component: UploadHoroscopeComponent;
  let fixture: ComponentFixture<UploadHoroscopeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadHoroscopeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadHoroscopeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
