import { TestBed } from '@angular/core/testing';

import { AppInitializationServiceService } from './app-initialization-service.service';

describe('AppInitializationServiceService', () => {
  let service: AppInitializationServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppInitializationServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
