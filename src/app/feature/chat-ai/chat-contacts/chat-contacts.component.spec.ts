import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatContactComponent } from './chat-contacts.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FeatureFlagService } from '@services/feature-flag.service';
import { MockFeatureFlagService } from '@services/mocks/mock-feature-flag.service';

describe('ChatContactComponent', () => {
  let component: ChatContactComponent;
  let fixture: ComponentFixture<ChatContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ChatContactComponent],
      providers: [{provide: FeatureFlagService, useClass: MockFeatureFlagService}]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChatContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should retrieve flgs', () => {
    expect(component.featureFlags).toBeTruthy();
  })

  it('should define a flag', () => {
    expect(component.featureFlags.Gemini).toBeDefined();
  })

  it('should set a flag as true', () => {
    expect(component.featureFlags.Mistral).toBeTrue();
  })

  it('should set a flag as false', () => {
    expect(component.featureFlags.PromptSampleText).toBeFalse();
  })

  it('should contain a flag', () => {
    expect(Object.keys(component.featureFlags)).toContain('Gemini');
  })
});
