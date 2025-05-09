import getChatService, { buildMessageRecord, getChatMessageContext } from "../ai-chat-service";
import { getAIResponse } from "../ai-query-service";

jest.mock("../ai-query-service", () => ({
    getAIResponse: jest.fn(),
}));

describe('AIChatService', () => {
    let updateChatLogMock;
    let chatService;

    beforeEach(() => {
        updateChatLogMock = jest.fn();
        chatService = getChatService(updateChatLogMock);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('buildMessageRecord should create a message record with the correct format', () => {
        const message = "Hello, how are you?";
        const source = "user";
        const result = buildMessageRecord(message, source);

        expect(result).toEqual({
            source: source,
            message: message,
            date: expect.any(String),
        });
    });

    test('getChatMessageContext should return the last 5 messages from the chat log', () => {
        const chatLog = Array.from({ length: 10 }, (_, i) => `Message ${i + 1}`);
        const result = getChatMessageContext(chatLog);

        expect(result).toEqual(chatLog.slice(5));
    });

    test('sendChat should call getAIResponse and update the chat log', async () => {
        const messages = ["Hello", "How are you?"];
        const mockResponse = { response: { output_text: "I'm fine, thank you!" } };
        
        getAIResponse.mockResolvedValue(mockResponse);

        await chatService.sendChat(messages);

        expect(getAIResponse).toHaveBeenCalledWith(messages);
        expect(updateChatLogMock).toHaveBeenCalledWith({
            source: 'assistant',
            message: mockResponse.response.output_text,
            date: expect.any(String),
        });
    });

    test('sendChat should handle errors gracefully', async () => {
        const messages = ["Hello", "How are you?"];
        
        getAIResponse.mockRejectedValue(new Error("Network error"));

        await chatService.sendChat(messages);

        expect(getAIResponse).toHaveBeenCalledWith(messages);
        expect(updateChatLogMock).not.toHaveBeenCalled();
    });

});