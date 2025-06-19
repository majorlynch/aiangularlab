import { Component, Input, Output, OnInit, EventEmitter } from "@angular/core";
import { ChatService } from "../../../services/chat-services";
import { CommonModule } from "@angular/common";
import { aiDetail } from "../../../shared/models/messageBase";

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

    aiList : aiDetail[] = [];

    constructor (private ChatService: ChatService) {}

    ngOnInit () {
        this.getContactData();
    }

    getContactData() {
        this.ChatService.getContactData().subscribe(res => this.aiList = res);
    }

    setSelectedContact(aiName: string) {
        this.setSelectedAi.emit(aiName);
    }

}
