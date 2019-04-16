import { TestBed } from '@angular/core/testing';

import { ManagePersonService } from './manage-person.service';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ManagePersonService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientModule, HttpClientTestingModule]
    })
  );

  it('should be created', () => {
    const service: ManagePersonService = TestBed.get(ManagePersonService);
    expect(service).toBeTruthy();
  });
});
