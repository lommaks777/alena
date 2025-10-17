// Vercel serverless function
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const newAnswers = req.body;
        console.log('Received answers:', newAnswers);
        
        // Путь к файлу с ответами
        const answersFilePath = join(process.cwd(), 'answers.json');
        
        // Читаем существующие данные
        let allAnswers = [];
        try {
            const data = await readFile(answersFilePath, 'utf8');
            allAnswers = JSON.parse(data);
        } catch (error) {
            // Если файл не существует, начинаем с пустого массива
            if (error.code !== 'ENOENT') {
                throw error;
            }
        }
        
        // Добавляем новые ответы с временной меткой
        const answersWithTimestamp = {
            ...newAnswers,
            timestamp: new Date().toISOString(),
            id: `quiz_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        };
        
        allAnswers.push(answersWithTimestamp);
        
        // Сохраняем обновленные данные
        await writeFile(answersFilePath, JSON.stringify(allAnswers, null, 2), 'utf8');
        
        res.status(200).json({ 
            message: 'Answers submitted successfully',
            data: answersWithTimestamp
        });
    } catch (error) {
        console.error('Error submitting answers:', error);
        res.status(500).json({ 
            message: 'Internal Server Error',
            error: error.message 
        });
    }
}