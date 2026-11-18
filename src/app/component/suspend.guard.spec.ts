import { TestBed } from '@angular/core/testing';

import { SuspendGuard } from './suspend.guard';

describe('SuspendGuard', () => {
  let guard: SuspendGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(SuspendGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
