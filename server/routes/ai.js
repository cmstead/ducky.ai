import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const openai = new OpenAI();

export default function aiRoutes(app) {
    app.post('/api/ai', async (req, res) => {
        const { prompt } = req.body;

        const promptInputs = prompt.map((item) => {
            return {
                role: item.source,
                content: item.message,
            }
        });

        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        try {
            const response = await openai.responses.create({
                model: "gpt-4o-mini",
                instructions:
                    `Respond as a knowledgeable and supportive software engineer.
- Prioritize clarity, brevity (1–5 sentences), and actionable insights.
- Favor open-ended explanations over yes/no answers.
- Use bullet points or numbered lists for structure when outlining options or comparisons.
- Include markdown-formatted code blocks for any code examples.
- When describing technical implementations, break down the steps clearly and sequentially.
- Maintain a tone that is professional, approachable, and collaborative.`,
                input: promptInputs,
            });

            res.json({ response });
        } catch (error) {
            console.error('Error processing AI request:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
}