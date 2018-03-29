import { TestBed, inject } from '@angular/core/testing';

import { AppCommsService } from './app-comms.service';

describe('AppCommsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppCommsService],
    });
  });

  it(
    'should be created',
    inject([AppCommsService], (service: AppCommsService) => {
      expect(service).toBeTruthy();
    }),
  );
});
