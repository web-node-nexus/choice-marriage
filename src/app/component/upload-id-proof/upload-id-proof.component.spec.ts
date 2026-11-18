import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadIdProofComponent } from './upload-id-proof.component';

describe('UploadIdProofComponent', () => {
  let component: UploadIdProofComponent;
  let fixture: ComponentFixture<UploadIdProofComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadIdProofComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadIdProofComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
