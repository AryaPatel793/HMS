import { TestBed } from '@angular/core/testing';

import { EditUserService } from './edit-user.service';

describe('UpdateUserService', () => {
  let service: EditUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EditUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
