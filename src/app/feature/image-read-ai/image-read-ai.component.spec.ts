import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageReadAiComponent } from './image-read-ai.component';

describe('ImageReadAiComponent', () => {
  let component: ImageReadAiComponent;
  let fixture: ComponentFixture<ImageReadAiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageReadAiComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImageReadAiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
