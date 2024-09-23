import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TermService } from './term.service';

describe('TermService', () => {
  let service: TermService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TermService]
    });
    service = TestBed.inject(TermService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should return all terms from the server', () => {
    const mockTerms = [{id: 1, name: 'test'}, {id: 2, name: 'test2'}];
    service.getAllTerms().subscribe(terms => {
      expect(terms).toEqual(mockTerms);
    });

    const req = httpMock.expectOne('http://8088/api/terms');
    expect(req.request.method).toEqual('GET');
    req.flush(mockTerms);
    // expect(service).toBeTruthy();
  });
});
