import { TestBed } from '@angular/core/testing';

import { BonusTableService } from './bonus-table.service';

describe('BonusTableService', () => {
  let service: BonusTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BonusTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
