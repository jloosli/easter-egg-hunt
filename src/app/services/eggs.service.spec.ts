import {TestBed} from '@angular/core/testing';

import {EggsService} from './eggs.service';

describe('EggsService', () => {
  let service: EggsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EggsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
