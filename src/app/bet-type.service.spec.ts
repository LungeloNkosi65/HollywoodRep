import { TestBed } from '@angular/core/testing';

import { BetTypeService } from './bet-type.service';

describe('BetTypeService', () => {
  let service: BetTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BetTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
