const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();

const answersFilePath = path.join(process.cwd(), 'answers.json');

app.get('/api/stats', async (req, res) => {
    try {
        let allAnswers = [];
        try {
            const data = await fs.readFile(answersFilePath, 'utf8');
            allAnswers = JSON.parse(data);
        } catch (error) {
            if (error.code === 'ENOENT') {
                // Если файл не найден, возвращаем пустую статистику
                return res.json({
                    totalResponses: 0,
                    resultsDistribution: {},
                    answersDistribution: {}
                });
            }
            throw error;
        }

        const totalResponses = allAnswers.length;

        // Распределение по результатам
        const resultsDistribution = allAnswers.reduce((acc, entry) => {
            const result = entry.result;
            acc[result] = (acc[result] || 0) + 1;
            return acc;
        }, {});

        // Распределение по ответам на каждый вопрос
        const answersDistribution = allAnswers.reduce((acc, entry) => {
            for (const [question, answer] of Object.entries(entry.answers)) {
                if (!acc[question]) {
                    acc[question] = { A: 0, B: 0, C: 0, D: 0 };
                }
                acc[question][answer] = (acc[question][answer] || 0) + 1;
            }
            return acc;
        }, {});

        res.json({
            totalResponses,
            resultsDistribution,
            answersDistribution
        });

    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = app;