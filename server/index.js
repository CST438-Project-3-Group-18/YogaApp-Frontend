const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_FILE = path.join(__dirname, 'db.sqlite');

const db = new sqlite3.Database(DB_FILE);

db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password_hash TEXT
    )`
  );

  db.run(
    `CREATE TABLE IF NOT EXISTS collections (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      name TEXT,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )`
  );
});

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Create user
app.post('/users', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'username and password required' });
  try {
    const hash = await bcrypt.hash(password, 10);
    const stmt = db.prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)');
    stmt.run(username, hash, function (err) {
      if (err) {
        if (err.code === 'SQLITE_CONSTRAINT') return res.status(409).json({ message: 'username already exists' });
        return res.status(500).json({ message: 'db error' });
      }
      res.status(201).json({ id: this.lastID, username });
    });
  } catch (e) {
    res.status(500).json({ message: 'server error' });
  }
});

// Login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'username and password required' });
  db.get('SELECT id, username, password_hash FROM users WHERE username = ?', username, async (err, row) => {
    if (err) return res.status(500).json({ message: 'db error' });
    if (!row) return res.status(401).json({ message: 'invalid credentials' });
    const match = await bcrypt.compare(password, row.password_hash);
    if (!match) return res.status(401).json({ message: 'invalid credentials' });
    // For simplicity return user id; in production use JWT or secure session
    res.json({ id: row.id, username: row.username });
  });
});

// Get collections for a user
app.get('/collections', (req, res) => {
  const userId = req.query.userId;
  if (!userId) return res.status(400).json({ message: 'userId required' });
  db.all('SELECT id, name FROM collections WHERE user_id = ?', userId, (err, rows) => {
    if (err) return res.status(500).json({ message: 'db error' });
    res.json(rows);
  });
});

// Add collection for a user
app.post('/collections', (req, res) => {
  const { userId, name } = req.body;
  if (!userId || !name) return res.status(400).json({ message: 'userId and name required' });
  const stmt = db.prepare('INSERT INTO collections (user_id, name) VALUES (?, ?)');
  stmt.run(userId, name, function (err) {
    if (err) return res.status(500).json({ message: 'db error' });
    res.status(201).json({ id: this.lastID, userId, name });
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
