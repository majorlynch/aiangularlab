import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PromptAiComponent } from './prompt-ai.component';

describe('PromptAiComponent', () => {
  let component: PromptAiComponent;
  let fixture: ComponentFixture<PromptAiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, PromptAiComponent],
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PromptAiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
