import { readFile } from 'fs/promises';
import { join } from 'path';

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const answersFilePath = join(process.cwd(), 'answers.json');
    try {
        let allAnswers = [];
        try {
            const data = await readFile(answersFilePath, 'utf8');
            allAnswers = JSON.parse(data);
        } catch (error) {
            if (error.code === 'ENOENT') {
                // Если файл не найден, возвращаем пустую статистику
                return res.status(200).json({
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

        res.status(200).json({
            totalResponses,
            resultsDistribution,
            answersDistribution
        });

    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}