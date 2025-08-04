import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})

export class MockFeatureFlagService {
    flags = {
        Gemini: true,
        Deepseek: true,
        ChatGPT: true,
        Mistral: true,
        PromptSampleText: false
    };

    getFlag(flag: keyof typeof this.flags): boolean {
        return this.flags[flag];
    }

    setflag(flag: keyof typeof this.flags, value: boolean) {
        this.flags[flag] = value;
    }

    getAllFlags(): typeof this.flags {
        return this.flags;
    }
}
