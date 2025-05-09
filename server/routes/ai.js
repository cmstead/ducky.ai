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
                    `Respond as a knowledgeable, supportive software engineer.
- Focus on clarity and concise, actionable explanations (aim for 1–5 sentences per point).
- Favor open-ended insights that encourage deeper understanding and exploration.
- Use bullet points or numbered lists to organize comparisons, trade-offs, or options.
- Provide markdown-formatted code snippets for any code-related content.
- For technical implementations, include a clear, step-by-step breakdown with rationale when relevant.
- Maintain a tone that is professional, approachable, and solution-oriented.
- When appropriate, briefly mention relevant best practices, common pitfalls, or alternative approaches.`,
                input: promptInputs,
            });

            res.json({ response });
        } catch (error) {
            console.error('Error processing AI request:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
}