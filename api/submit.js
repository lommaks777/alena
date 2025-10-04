const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
app.use(express.json());

const answersFilePath = path.join(process.cwd(), 'answers.json');

app.post('/api/submit', async (req, res) => {
    try {
        const newAnswers = req.body;

        let allAnswers = [];
        try {
            const data = await fs.readFile(answersFilePath, 'utf8');
            allAnswers = JSON.parse(data);
        } catch (error) {
            if (error.code !== 'ENOENT') {
                throw error;
            }
        }

        allAnswers.push({
            timestamp: new Date().toISOString(),
            answers: newAnswers
        });

        await fs.writeFile(answersFilePath, JSON.stringify(allAnswers, null, 2));

        res.status(200).json({ message: 'Answers submitted successfully' });
    } catch (error) {
        console.error('Error submitting answers:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = app;