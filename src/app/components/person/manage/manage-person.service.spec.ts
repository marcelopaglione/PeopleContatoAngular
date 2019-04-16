import { TestBed } from '@angular/core/testing';

import { ManagePersonService } from './manage-person.service';

describe('ManagePersonService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ManagePersonService = TestBed.get(ManagePersonService);
    expect(service).toBeTruthy();
  });
});
