import { TestBed } from '@angular/core/testing';

import { ChartAnalysisService } from './chart-analysis.service';

describe('ChartAnalysisService', () => {
  let service: ChartAnalysisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChartAnalysisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
