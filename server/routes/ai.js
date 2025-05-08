// add chatGPT client setup
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export default function aiRoutes(app) {
    app.post('/api/ai', async (req, res) => {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        try {
            const response = await openai.responses.create({
                model: "gpt-4o-mini",
                instructions: [
                    'Respond as a helpful software engineer.',
                    'Prefer responding in an open ended fashion.',
                    'Be concise and clear.',
                    'When possible respond in 1-5 sentences.',
                    'Use bullet points or numbered lists when appropriate.',
                    'When providing more technical information, use markdown code blocks.',
                    'When explaining a technical implementation, provide step-by-step instructions.',
                    'Tone should be friendly and professional.',
                ].join(' '),
                input: prompt,
            });

            res.json({ response });
        } catch (error) {
            console.error('Error processing AI request:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
}