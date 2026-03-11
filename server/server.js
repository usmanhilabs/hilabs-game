const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const leaderboardPath = path.join(__dirname, 'leaderboard.json');
const dataPath = path.join(__dirname, '../data');

// Initialize leaderboard if it doesn't exist
if (!fs.existsSync(leaderboardPath)) {
  fs.writeFileSync(leaderboardPath, JSON.stringify([]));
}

// Ensure data directory exists
if (!fs.existsSync(dataPath)) {
  fs.mkdirSync(dataPath);
}

// Endpoints
app.get('/leaderboard', (req, res) => {
  try {
    const data = fs.readFileSync(leaderboardPath, 'utf8');
    const leaderboard = JSON.parse(data);
    res.json(leaderboard);
  } catch (error) {
    console.error('Error reading leaderboard:', error);
    res.status(500).json({ error: 'Failed to read leaderboard' });
  }
});

app.post('/leaderboard', (req, res) => {
  try {
    const { name, score } = req.body;
    
    if (!name || score === undefined) {
      return res.status(400).json({ error: 'Name and score are required' });
    }

    const data = fs.readFileSync(leaderboardPath, 'utf8');
    const leaderboard = JSON.parse(data);

    const newEntry = {
      name,
      score,
      timestamp: new Date().toISOString()
    };

    leaderboard.push(newEntry);
    
    // Sort by score descending and take top 10
    leaderboard.sort((a, b) => b.score - a.score);
    const topLeaderboard = leaderboard.slice(0, 10);

    fs.writeFileSync(leaderboardPath, JSON.stringify(topLeaderboard, null, 2));
    
    res.status(201).json(newEntry);
  } catch (error) {
    console.error('Error updating leaderboard:', error);
    res.status(500).json({ error: 'Failed to update leaderboard' });
  }
});

app.get('/questions/round1', (req, res) => {
  try {
    const questionsPath = path.join(dataPath, 'round1_questions.json');
    if (!fs.existsSync(questionsPath)) {
       return res.json([]);
    }
    const data = fs.readFileSync(questionsPath, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    console.error('Error reading round 1 questions:', error);
    res.status(500).json({ error: 'Failed to read questions' });
  }
});

app.get('/questions/round2', (req, res) => {
    try {
      const questionsPath = path.join(dataPath, 'round2_questions.json');
      if (!fs.existsSync(questionsPath)) {
          return res.json([]);
      }
      const data = fs.readFileSync(questionsPath, 'utf8');
      res.json(JSON.parse(data));
    } catch (error) {
      console.error('Error reading round 2 questions:', error);
      res.status(500).json({ error: 'Failed to read questions' });
    }
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
