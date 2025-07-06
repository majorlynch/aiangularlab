export interface MessageDetail {
    userId: Number,
    userName: string,
    userImage: string,
    userStatus: string,
    userType: string,
    messageDetail: string,
    messageTime: Date,
    messageTimeText?: string
}

export interface ChatContent {
    aiName: string,
    messageDetail: MessageDetail[],
}

export interface TextPrompt {
    text: string
}

export interface aiDetail {
    aiName: string,
    aiImage: string,
    aiOnlineStatus: string,
    featured?: boolean
}

export interface ChatHistory {
    role: string,
    content: string
}
