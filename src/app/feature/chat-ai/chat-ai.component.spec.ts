import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ChatAiComponent } from './chat-ai.component';

describe('ChatAiComponent', () => {
  let component: ChatAiComponent;
  let fixture: ComponentFixture<ChatAiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ChatAiComponent],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatAiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
});

describe("A suite is just a function", function() {
  let a;

  it("and so is a spec", function() {
    a = true;

    expect(a).toBe(true);
  });
});