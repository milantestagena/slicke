import { TestBed } from '@angular/core/testing';

import { HTTPService } from './services/http.service';

describe('ApiService', () => {
  let service: HTTPService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HTTPService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
