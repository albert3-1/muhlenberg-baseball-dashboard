# Muhlenberg Baseball Scouting Dashboard

A web dashboard for comparing Muhlenberg baseball stats against other Centennial Conference teams and generating AI-powered scouting reports.

## Features

- **Head-to-Head Comparisons**: Compare batting and pitching stats between Muhlenberg and any conference opponent
- **Player Statistics**: View sortable tables of all qualified batters and pitchers
- **AI Scouting Reports**: Generate game-prep reports from either team's perspective using Claude AI
- **Print/Export**: Print scouting reports as PDFs for coaching staff

## Centennial Conference Teams

Muhlenberg, Johns Hopkins, Gettysburg, Haverford, McDaniel, Washington College, Franklin & Marshall, Swarthmore, Ursinus, Dickinson

## How to Run

1. Open `muhlenberg-dashboard.html` in your browser
2. Enter your Anthropic API key (for AI scouting reports)
3. Select an opponent and explore the stats

## Files

- `muhlenberg-dashboard.html` - The main dashboard
- `scrape_stats.py` - Python script to scrape fresh stats from team websites
- `server.py` - Backend server for AI report generation
- `ScoutingDashboard.jsx` - React component source code

## Built With

This project was built using **vibe coding** - describing features in plain English and iterating with Claude Code. No traditional programming knowledge required.

See `VIBE_CODING_GUIDE.md` for a guide on how to vibe code your own projects.

---

*Go Mules!*
