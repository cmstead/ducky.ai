import { getAIResponse } from "./ai-query-service";


export function buildMessageRecord(message, source) {
    return {
        source: source,
        message: message,
        date: new Date().toLocaleTimeString()
    }
}

export function getChatMessageContext(chatLog) {
    const messageCount = 5;
    const startIndex = Math.max(0, chatLog.length - messageCount);
    return chatLog.slice(startIndex);
}

export default function getChatService(updateChatLog) {
    function sendChat(messages) {
        return getAIResponse(messages)
            .then((response) => {
                const responseRecord = buildMessageRecord(response.response.output_text, 'assistant');

                updateChatLog(responseRecord);
            })
            .catch((error) => {
                console.error('Error fetching AI response:', error);
            });
    }

    return {
        sendChat
    };
}