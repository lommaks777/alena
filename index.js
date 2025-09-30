// Простой сервер для Vercel
const express = require('express');
const path = require('path');

const app = express();

// Статические файлы
app.use(express.static('.'));

// Главная страница
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Квиз
app.get('/quiz', (req, res) => {
    res.sendFile(path.join(__dirname, 'quiz.html'));
});

module.exports = app;
