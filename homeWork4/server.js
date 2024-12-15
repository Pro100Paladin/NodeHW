// server.js
const express = require('express');
const fs = require('fs').promises;

const app = express();
app.use(express.json());

const USERS_FILE = 'users.json';

// Middleware для чтения файла с пользователями
const readUsersFile = async (req, res, next) => {
    try {
        const usersData = await fs.readFile(USERS_FILE, 'utf8');
        req.users = JSON.parse(usersData);
        next();
    } catch (err) {
        console.error('Error reading users file:', err);
        res.status(500).send('Internal Server Error');
    }
};

// Middleware для записи данных пользователей в файл
const writeUsersFile = async (users) => {
    try {
        await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
    } catch (err) {
        console.error('Error writing users file:', err);
        throw new Error('Failed to write users data');
    }
};

app.get('/', (req, res)=> {
    let html = '<h1>начальная страница сайта</h1>';
    res.send(html);
});

// Получение всех пользователей
app.get('/users', readUsersFile, (req, res) => {
    res.json(req.users);
});

// Получение пользователя по ID
app.get('/users/:id', readUsersFile, (req, res) => {
    const user = req.users.find(user => user.id === parseInt(req.params.id));
    if (!user) return res.status(404).send('User not found');
    res.json(user);
});

// Создание нового пользователя
app.post('/users', readUsersFile, async (req, res) => {
    const newUser = req.body;
    req.users.push(newUser);
    try {
        await writeUsersFile(req.users);
        res.status(201).send('User created successfully');
    } catch (err) {
        res.status(500).send('Failed to create user');
    }
});

// Обновление пользователя
app.put('/users/:id', readUsersFile, async (req, res) => {
    const userId = parseInt(req.params.id);
    const updateUser = req.body;
    const index = req.users.findIndex(user => user.id === userId);
    if (index === -1) return res.status(404).send('User not found');
    req.users[index] = { ...req.users[index], ...updateUser };
    try {
        await writeUsersFile(req.users);
        res.send('User updated successfully');
    } catch (err) {
        res.status(500).send('Failed to update user');
    }
});

// Удаление пользователя
app.delete('/users/:id', readUsersFile, async (req, res) => {
    const userId = parseInt(req.params.id);
    const index = req.users.findIndex(user => user.id === userId);
    if (index === -1) return res.status(404).send('User not found');
    req.users.splice(index, 1);
    try {
        await writeUsersFile(req.users);
        res.send('User deleted successfully');
    } catch (err) {
        res.status(500).send('Failed to delete user');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});