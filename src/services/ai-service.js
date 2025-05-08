import axios from "axios";

export function getAIResponse(chatLog) {
    const url = 'http://localhost:3001/api/ai';
    const headers = {
        'Content-Type': 'application/json',
    };

    return axios.post(url, {
        prompt: chatLog
    }, { headers })
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.error('Error fetching AI response:', error);
            throw error;
        });
}