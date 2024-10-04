import { TestBed } from '@angular/core/testing';

import { ClazzService } from './clazz.service';

describe('ClazzService', () => {
  let service: ClazzService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClazzService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
