import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageGenAiComponent } from './image-gen-ai.component';

describe('ImageGenAiComponent', () => {
  let component: ImageGenAiComponent;
  let fixture: ComponentFixture<ImageGenAiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageGenAiComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImageGenAiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
