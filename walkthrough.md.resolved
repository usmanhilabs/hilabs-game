# Walkthrough: HiLabs Data Cleaning Challenge

## Overview
I have successfully built and locally deployed the complete web-based mini-game "Beat the AI: Data Cleaning Challenge" tailored for the HiLabs techfest booth. The game flow, theme, and persistence requirements have been fully implemented.

## Completed Features
- **Project Scaffold**: Frontend built with React + Vite (`client/`). Backend built with Node.js + Express (`server/`).
- **Styling**: Configured global CSS ([index.css](file:///Users/usman.khatri/StudioProjects/hilabs-game/client/src/index.css)) matching HiLabs brand colors (Navy, Neon Blue, Vibrant Orange). Included fast-paced arcade animations like glowing inputs, flashing answer buttons (green/red), sliding text, and a score counter animation.
- **Game Engine Components**:
  - [StartScreen](file:///Users/usman.khatri/StudioProjects/hilabs-game/client/src/components/StartScreen.jsx#5-69): Grabs the user's name and displays the top 5 ranking preview.
  - [Game](file:///Users/usman.khatri/StudioProjects/hilabs-game/client/src/components/Game.jsx#7-134): Fetches randomized questions per round from the backend JSON files, runs a strict 30s timer per round with an animated progress bar.
  - [QuestionCard](file:///Users/usman.khatri/StudioProjects/hilabs-game/client/src/components/QuestionCard.jsx#3-71): Shows dataset tables natively using mono-space fonts and grid option buttons.
  - [FinalScoreScreen](file:///Users/usman.khatri/StudioProjects/hilabs-game/client/src/components/FinalScoreScreen.jsx#6-116): Includes a `canvas-confetti` explosion for high scores, count-up animation for total score, and saves the data back to the server.
  - [Leaderboard](file:///Users/usman.khatri/StudioProjects/hilabs-game/client/src/components/Leaderboard.jsx#5-83): Displays the full Top 10 scrolling leaderboard. Backed by local persistent [leaderboard.json](file:///Users/usman.khatri/StudioProjects/hilabs-game/server/leaderboard.json) so it survives restarts.
- **Data Persistence**: Configured [leaderboard.json](file:///Users/usman.khatri/StudioProjects/hilabs-game/server/leaderboard.json) via local file APIs on the Node server. Created initial sample datasets for deduplication and error spotting.
- **Operator Mode**: Implemented a global keyboard listener for the `N` key (when not typing in an input field) to instantly reset the game for the next player without reloading the page.

## Testing & Verification
I successfully launched both the Node API and Vite dev servers and used an automated browser subagent to play through a complete game session. 

### Final UI Demo
Below is a demonstration of the functional UI during game play and leaderboard preview.

**Gameplay Flow Preview:**
![Gameplay Demo](/Users/usman.khatri/.gemini/antigravity/brain/65888c50-e418-44ef-8aaf-f38ff16203f0/hilabs_game_demo_1773231005019.webp)

**Leaderboard Component:**
![Leaderboard Final Preview](/Users/usman.khatri/.gemini/antigravity/brain/65888c50-e418-44ef-8aaf-f38ff16203f0/leaderboard_with_testuser_scrolled_1773231076271.png)

## Local Run Instructions 🚀
You can start this software at any time on the booth laptop by opening two terminal tabs pointing to the project root (`/Users/usman.khatri/StudioProjects/hilabs-game`), and running:

**Terminal 1 (Backend):**
```bash
cd server
npm start # (or 'node server.js')
```

**Terminal 2 (Frontend):**
```bash
cd client
npm run dev
```
Then visit `http://localhost:5173`. Let the games begin!
