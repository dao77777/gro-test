export type LeadMessage = {
    id: string,
    name: string,
    role: string,
    company: string,
    message: string,
    linkedinUrl: string,
    isGenerating: boolean,
    isGenerateError?: Error,
    isDraftMessageReady: boolean
};