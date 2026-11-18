import { TestBed } from '@angular/core/testing';

import { CheckProfileStatusGuard } from './check-profile-status.guard';

describe('CheckProfileStatusGuard', () => {
  let guard: CheckProfileStatusGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CheckProfileStatusGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
