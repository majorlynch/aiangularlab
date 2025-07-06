import { Component, Input, Output, OnInit, EventEmitter } from "@angular/core";
import { ChatService } from "@services/chat-services";
import { CommonModule } from "@angular/common";
import { aiDetail } from "../../../shared/models/chat.models";
import { FeatureFlagService } from "src/app/core/services/feature-flag.service";
import { finalize } from "rxjs";

@Component( {
    selector: 'app-chat-contacts',
    templateUrl: './chat-contacts.html',
    styleUrl: './chat-contacts.css',
    standalone: true,
    imports: [CommonModule]
})

export class ChatAiContacts implements OnInit {
    @Input() selectedAI: string = '';
    @Output() setSelectedAi = new EventEmitter<string>();
    @Output() savePdf = new EventEmitter<string>();

    featureFlags: {} ={};
    aiList : aiDetail[] = [];

    constructor(private featureFlagService: FeatureFlagService,
                private chatService: ChatService) {}

    ngOnInit () {
      this.featureFlags = this.featureFlagService.getAllFlags();
      this.getContactData();
    }

    getContactData() {
        this.chatService.getContactData().pipe(finalize(() => {console.log(this.aiList)}))
        .subscribe(res => this.aiList = res);
    }

    setSelectedContact(aiName: string) {
        this.setSelectedAi.emit(aiName);
    }

    //saveChatPdf() {
    //    this.savePdf.emit();
    //}

}
