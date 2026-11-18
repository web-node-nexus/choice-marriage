import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddsucessstoryComponent } from './addsucessstory.component';

describe('AddsucessstoryComponent', () => {
  let component: AddsucessstoryComponent;
  let fixture: ComponentFixture<AddsucessstoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddsucessstoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddsucessstoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
