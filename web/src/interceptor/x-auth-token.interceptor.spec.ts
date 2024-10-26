import { TestBed } from '@angular/core/testing';

import { XAuthTokenInterceptor } from './x-auth-token.interceptor';

describe('XAuthTokenInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      XAuthTokenInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: XAuthTokenInterceptor = TestBed.inject(XAuthTokenInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
