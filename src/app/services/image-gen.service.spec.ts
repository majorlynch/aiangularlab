import { TestBed } from '@angular/core/testing';

import { ImageGenService } from './image-gen.service';

describe('ImageGenService', () => {
  let service: ImageGenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageGenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
