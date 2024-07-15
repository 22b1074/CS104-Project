const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.json());
app.use(express.static('photos'));



// Endpoint to handle login
app.get('/login', (req, res) => {
    const { username, password } = req.query;
    const users = loadUsers();

    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
        res.json({ success: true });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

// Endpoint to handle 'forgot' requests
app.get('/forgot', (req, res) => {
    const { username } = req.query;
    const users = loadUsers();

    const user = users.find(user => user.username === username);

    if (user) {
        res.json({ success: true, secret_question: user.secret_question });
    } else {
        res.status(401).json({ error: 'Invalid username' });
    }
});

// Endpoint to verify answer for 'forgot' requests
app.get('/verifyAnswer', (req, res) => {
    const { username, answer } = req.query;
    const users = loadUsers();

    const user = users.find(user => user.username === username && user.secret_answer === answer);

    if (user) {
        res.json({ success: true, password: user.password });
    } else {
        res.status(401).json({ error: 'Invalid answer' });
    }
});

// Define a route to serve profile data from students.json
app.get('/profiles', (req, res) => {
    const profileData = loadProfiles();
    res.json(profileData);
});


function loadUsers() {
    const data = fs.readFileSync('login.json', 'utf8');
    return JSON.parse(data);
}

function loadProfiles() {
    const profileData = fs.readFileSync('students.json', 'utf8');
    return JSON.parse(profileData);
}

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});

