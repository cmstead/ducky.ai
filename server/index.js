import 'dotenv/config'

import express from 'express';
import cors from 'cors';

import aiRoutes from './routes/ai.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.send('Server is running');
});

aiRoutes(app);

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
