import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UsersService]
    });

    service = TestBed.inject(UsersService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure no outstanding HTTP requests
  });

  it('should retrieve users without a search keyword', () => {
    const mockResponse = { users: [{ id: 1, name: 'John Doe' }] };
    const params = { limit: '10' };

    service.getUsers(params).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`https://dummyjson.com/users/?limit=10`);
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('limit')).toBe('10');
    req.flush(mockResponse); // Provide mock response
  });

  it('should retrieve users with a search keyword', () => {
    const mockResponse = { users: [{ id: 2, name: 'Jane Doe' }] };
    const params = { limit: '5' };
    const keyword = 'Jane';

    service.getUsers(params, keyword).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`https://dummyjson.com/users/search?q=Jane&limit=5`);
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('limit')).toBe('5');
    req.flush(mockResponse); // Provide mock response
  });
});
