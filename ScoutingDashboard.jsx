import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { RefreshCw, Key, Eye, EyeOff, ChevronDown, TrendingUp, Target, Users, Zap, AlertTriangle, X, Loader2, Printer, FileText } from 'lucide-react';

// ============================================================================
// DATA & CONFIGURATION
// ============================================================================

const TEAMS = {
  muh: {
    id: 453,
    code: 'muh',
    name: 'Muhlenberg',
    mascot: 'Mules',
    color: '#8B0000',
    isHome: true
  },
  jhu: {
    id: 322,
    code: 'jhu',
    name: 'Johns Hopkins',
    mascot: 'Blue Jays',
    color: '#002D72'
  },
  get: {
    id: 298,
    code: 'get',
    name: 'Gettysburg',
    mascot: 'Bullets',
    color: '#F47920'
  },
  hav: {
    id: 303,
    code: 'hav',
    name: 'Haverford',
    mascot: 'Fords',
    color: '#8B0000'
  },
  mcd: {
    id: 391,
    code: 'mcd',
    name: 'McDaniel',
    mascot: 'Green Terror',
    color: '#006747'
  },
  wac: {
    id: 565,
    code: 'wac',
    name: 'Washington College',
    mascot: 'Shoremen',
    color: '#800000'
  },
  fandm: {
    id: 294,
    code: 'fandm',
    name: 'Franklin & Marshall',
    mascot: 'Diplomats',
    color: '#003366'
  },
  swa: {
    id: 526,
    code: 'swa',
    name: 'Swarthmore',
    mascot: 'Garnet',
    color: '#800000'
  },
  urs: {
    id: 548,
    code: 'urs',
    name: 'Ursinus',
    mascot: 'Bears',
    color: '#8B0000'
  },
  dick: {
    id: 252,
    code: 'dick',
    name: 'Dickinson',
    mascot: 'Red Devils',
    color: '#C41230'
  }
};

// Fallback 2025 stats (embedded for offline use)
const FALLBACK_TEAM_STATS = {
  muh: {
    batting: { avg: .298, obp: .420, slg: .426, g: 39, r: 293, hr: 23, sb: 64, rbi: 247 },
    pitching: { era: 7.56, wins: 19, losses: 20, so: 224, bb: 160, whip: 1.82, fldPct: .950 }
  },
  jhu: {
    batting: { avg: .338, obp: .426, slg: .609, g: 49, r: 490, hr: 110, sb: 52, rbi: 458 },
    pitching: { era: 3.72, wins: 44, losses: 5, so: 387, bb: 155, whip: 1.27, fldPct: .968 }
  },
  get: {
    batting: { avg: .330, obp: .452, slg: .460, g: 41, r: 391, hr: 25, sb: 73, rbi: 342 },
    pitching: { era: 4.94, wins: 30, losses: 11, so: 280, bb: 136, whip: 1.37, fldPct: .961 }
  },
  hav: {
    batting: { avg: .327, obp: .443, slg: .544, g: 40, r: 403, hr: 63, sb: 127, rbi: 360 },
    pitching: { era: 7.78, wins: 24, losses: 16, so: 323, bb: 205, whip: 1.80, fldPct: .952 }
  },
  mcd: {
    batting: { avg: .318, obp: .415, slg: .459, g: 42, r: 343, hr: 23, sb: 59, rbi: 308 },
    pitching: { era: 7.07, wins: 19, losses: 22, so: 253, bb: 236, whip: 1.89, fldPct: .954 }
  },
  wac: {
    batting: { avg: .315, obp: .401, slg: .484, g: 40, r: 318, hr: 39, sb: 93, rbi: 279 },
    pitching: { era: 7.36, wins: 19, losses: 21, so: 234, bb: 194, whip: 1.88, fldPct: .956 }
  },
  fandm: {
    batting: { avg: .303, obp: .408, slg: .423, g: 40, r: 289, hr: 17, sb: 71, rbi: 262 },
    pitching: { era: 5.73, wins: 21, losses: 19, so: 285, bb: 201, whip: 1.66, fldPct: .953 }
  },
  swa: {
    batting: { avg: .299, obp: .418, slg: .447, g: 42, r: 362, hr: 42, sb: 101, rbi: 309 },
    pitching: { era: 6.79, wins: 24, losses: 18, so: 269, bb: 205, whip: 1.81, fldPct: .960 }
  },
  urs: {
    batting: { avg: .277, obp: .403, slg: .360, g: 40, r: 278, hr: 11, sb: 100, rbi: 243 },
    pitching: { era: 5.01, wins: 20, losses: 20, so: 239, bb: 151, whip: 1.53, fldPct: .966 }
  },
  dick: {
    batting: { avg: .272, obp: .391, slg: .367, g: 35, r: 211, hr: 10, sb: 65, rbi: 182 },
    pitching: { era: 5.79, wins: 16, losses: 19, so: 253, bb: 130, whip: 1.56, fldPct: .940 }
  }
};

// Fallback player rosters (2025 data - real names from Johns Hopkins, sample for others)
const FALLBACK_PLAYERS = {
  muh: {
    batters: [
      { name: 'Marc Quarrie', avg: .404, r: 62, hr: 11, rbi: 49, sb: 8 },
      { name: 'Brendan Bussiere', avg: .354, r: 35, hr: 3, rbi: 28, sb: 12 },
      { name: 'Jack Kent', avg: .351, r: 39, hr: 4, rbi: 34, sb: 2 },
      { name: 'Brendan Hughes', avg: .329, r: 32, hr: 2, rbi: 39, sb: 5 },
      { name: 'Tyler Morrison', avg: .301, r: 28, hr: 1, rbi: 22, sb: 8 },
      { name: 'Chris Longo', avg: .287, r: 25, hr: 2, rbi: 18, sb: 15 }
    ],
    pitchers: [
      { name: 'Brendan Hughes', era: 4.22, w: 3, l: 1, so: 38, bb: 15 },
      { name: 'Kieran Mulholland', era: 5.53, w: 2, l: 2, so: 28, bb: 18 },
      { name: 'Luke Foley', era: 9.12, w: 1, l: 6, so: 32, bb: 25 },
      { name: 'Matt Simmons', era: 6.85, w: 2, l: 3, so: 24, bb: 20 }
    ]
  },
  jhu: {
    batters: [
      { name: 'Dillon Souvignier', avg: .421, r: 58, hr: 16, rbi: 62, sb: 13 },
      { name: 'Jimmy Stevens', avg: .375, r: 72, hr: 20, rbi: 68, sb: 10 },
      { name: 'Shawn Steuerer', avg: .369, r: 55, hr: 17, rbi: 56, sb: 8 },
      { name: 'Jacob Harris', avg: .341, r: 45, hr: 9, rbi: 50, sb: 1 },
      { name: 'Lukas Geer', avg: .341, r: 38, hr: 4, rbi: 27, sb: 1 },
      { name: 'Caleb Cyr', avg: .337, r: 52, hr: 12, rbi: 44, sb: 2 },
      { name: 'Alex Shane', avg: .332, r: 48, hr: 11, rbi: 41, sb: 3 },
      { name: 'Dylan Whitney', avg: .288, r: 35, hr: 6, rbi: 31, sb: 6 },
      { name: 'Jake Siani', avg: .312, r: 32, hr: 6, rbi: 32, sb: 8 }
    ],
    pitchers: [
      { name: 'Drew Grumbles', era: 1.75, w: 8, l: 0, so: 73, bb: 18 },
      { name: 'Grant Meert', era: 1.19, w: 1, l: 0, so: 42, bb: 12 },
      { name: 'Ryan Anderson', era: 3.04, w: 5, l: 1, so: 26, bb: 14 },
      { name: 'Kieren Collins', era: 3.38, w: 9, l: 2, so: 60, bb: 22 },
      { name: 'Quinn Rovner', era: 5.43, w: 7, l: 1, so: 34, bb: 18 },
      { name: 'William Boneno', era: 3.95, w: 4, l: 0, so: 32, bb: 12 }
    ]
  },
  get: {
    batters: [
      { name: 'Tyler Reynolds', avg: .385, r: 52, hr: 5, rbi: 45, sb: 18 },
      { name: 'Jake Morrison', avg: .362, r: 48, hr: 4, rbi: 38, sb: 12 },
      { name: 'Connor Walsh', avg: .341, r: 45, hr: 6, rbi: 42, sb: 8 },
      { name: 'Ryan Peters', avg: .328, r: 38, hr: 3, rbi: 35, sb: 15 },
      { name: 'Mike Johnson', avg: .315, r: 35, hr: 4, rbi: 32, sb: 10 },
      { name: 'Chris Davis', avg: .298, r: 28, hr: 3, rbi: 28, sb: 10 }
    ],
    pitchers: [
      { name: 'Ben Thompson', era: 3.85, w: 8, l: 2, so: 68, bb: 28 },
      { name: 'Kyle Martinez', era: 4.52, w: 6, l: 3, so: 52, bb: 22 },
      { name: 'Jack Wilson', era: 5.21, w: 5, l: 2, so: 45, bb: 25 },
      { name: 'Matt Garcia', era: 5.89, w: 4, l: 2, so: 38, bb: 18 }
    ]
  },
  hav: {
    batters: [
      { name: 'Andrew Chen', avg: .392, r: 58, hr: 12, rbi: 52, sb: 28 },
      { name: 'James Miller', avg: .365, r: 52, hr: 10, rbi: 48, sb: 22 },
      { name: 'Kevin Park', avg: .348, r: 48, hr: 8, rbi: 42, sb: 18 },
      { name: 'Daniel Lee', avg: .332, r: 42, hr: 9, rbi: 38, sb: 15 },
      { name: 'Brian Kim', avg: .318, r: 38, hr: 6, rbi: 35, sb: 20 },
      { name: 'Tom Wright', avg: .295, r: 32, hr: 5, rbi: 28, sb: 12 }
    ],
    pitchers: [
      { name: 'Ryan Lee', era: 5.85, w: 6, l: 4, so: 78, bb: 45 },
      { name: 'Chris Park', era: 6.92, w: 5, l: 3, so: 62, bb: 38 },
      { name: 'Mike Chen', era: 7.45, w: 4, l: 3, so: 55, bb: 35 },
      { name: 'Dan Wright', era: 8.12, w: 3, l: 2, so: 42, bb: 28 }
    ]
  },
  mcd: {
    batters: [
      { name: 'Josh Taylor', avg: .375, r: 48, hr: 5, rbi: 42, sb: 12 },
      { name: 'Adam Brown', avg: .352, r: 42, hr: 4, rbi: 38, sb: 10 },
      { name: 'Nick Smith', avg: .335, r: 38, hr: 5, rbi: 35, sb: 8 },
      { name: 'Sam Wilson', avg: .318, r: 35, hr: 3, rbi: 32, sb: 12 },
      { name: 'Eric Jones', avg: .298, r: 28, hr: 3, rbi: 28, sb: 8 },
      { name: 'Luke Davis', avg: .285, r: 25, hr: 2, rbi: 22, sb: 5 }
    ],
    pitchers: [
      { name: 'Mike Taylor', era: 5.45, w: 5, l: 5, so: 58, bb: 52 },
      { name: 'Chris Brown', era: 6.85, w: 4, l: 5, so: 48, bb: 45 },
      { name: 'Tom Smith', era: 7.25, w: 3, l: 4, so: 42, bb: 38 },
      { name: 'Dan Johnson', era: 8.15, w: 2, l: 3, so: 35, bb: 32 }
    ]
  },
  wac: {
    batters: [
      { name: 'Kyle Anderson', avg: .368, r: 45, hr: 8, rbi: 42, sb: 22 },
      { name: 'Matt Roberts', avg: .345, r: 42, hr: 7, rbi: 38, sb: 18 },
      { name: 'Brian Walsh', avg: .328, r: 38, hr: 6, rbi: 35, sb: 15 },
      { name: 'Steve Collins', avg: .312, r: 32, hr: 5, rbi: 28, sb: 12 },
      { name: 'John Murphy', avg: .295, r: 28, hr: 4, rbi: 25, sb: 10 },
      { name: 'Dan Kelly', avg: .278, r: 25, hr: 3, rbi: 22, sb: 8 }
    ],
    pitchers: [
      { name: 'Ryan Murphy', era: 5.95, w: 5, l: 5, so: 52, bb: 42 },
      { name: 'Mike Kelly', era: 6.85, w: 4, l: 4, so: 45, bb: 38 },
      { name: 'Chris Walsh', era: 7.45, w: 3, l: 4, so: 38, bb: 35 },
      { name: 'Tom Collins', era: 8.25, w: 2, l: 3, so: 32, bb: 28 }
    ]
  },
  fandm: {
    batters: [
      { name: 'Andrew Scott', avg: .358, r: 42, hr: 4, rbi: 38, sb: 15 },
      { name: 'James White', avg: .335, r: 38, hr: 3, rbi: 35, sb: 12 },
      { name: 'Kevin Black', avg: .318, r: 35, hr: 3, rbi: 32, sb: 10 },
      { name: 'Daniel Green', avg: .298, r: 28, hr: 2, rbi: 25, sb: 12 },
      { name: 'Brian Gray', avg: .285, r: 25, hr: 2, rbi: 22, sb: 8 },
      { name: 'Tom Brown', avg: .268, r: 22, hr: 1, rbi: 18, sb: 8 }
    ],
    pitchers: [
      { name: 'Ryan White', era: 4.85, w: 6, l: 4, so: 65, bb: 45 },
      { name: 'Chris Black', era: 5.45, w: 5, l: 4, so: 55, bb: 40 },
      { name: 'Mike Green', era: 6.25, w: 4, l: 4, so: 48, bb: 35 },
      { name: 'Dan Gray', era: 6.85, w: 3, l: 3, so: 38, bb: 28 }
    ]
  },
  swa: {
    batters: [
      { name: 'Tyler Adams', avg: .365, r: 52, hr: 9, rbi: 45, sb: 22 },
      { name: 'Jake Wilson', avg: .342, r: 45, hr: 7, rbi: 42, sb: 18 },
      { name: 'Connor Davis', avg: .318, r: 42, hr: 6, rbi: 38, sb: 15 },
      { name: 'Ryan Moore', avg: .298, r: 35, hr: 5, rbi: 32, sb: 18 },
      { name: 'Mike Taylor', avg: .282, r: 28, hr: 4, rbi: 28, sb: 12 },
      { name: 'Chris Brown', avg: .265, r: 25, hr: 3, rbi: 22, sb: 10 }
    ],
    pitchers: [
      { name: 'Ben Adams', era: 5.45, w: 6, l: 4, so: 62, bb: 45 },
      { name: 'Kyle Wilson', era: 6.25, w: 5, l: 4, so: 52, bb: 40 },
      { name: 'Jack Davis', era: 6.95, w: 4, l: 3, so: 45, bb: 35 },
      { name: 'Matt Moore', era: 7.85, w: 3, l: 3, so: 38, bb: 30 }
    ]
  },
  urs: {
    batters: [
      { name: 'Josh Miller', avg: .335, r: 38, hr: 2, rbi: 32, sb: 22 },
      { name: 'Adam Lee', avg: .312, r: 35, hr: 2, rbi: 28, sb: 18 },
      { name: 'Nick Kim', avg: .295, r: 32, hr: 2, rbi: 25, sb: 15 },
      { name: 'Sam Park', avg: .278, r: 28, hr: 1, rbi: 22, sb: 18 },
      { name: 'Eric Chen', avg: .265, r: 25, hr: 1, rbi: 18, sb: 12 },
      { name: 'Luke Wright', avg: .248, r: 22, hr: 1, rbi: 15, sb: 10 }
    ],
    pitchers: [
      { name: 'Mike Miller', era: 4.25, w: 6, l: 5, so: 55, bb: 32 },
      { name: 'Chris Lee', era: 4.85, w: 5, l: 5, so: 48, bb: 28 },
      { name: 'Tom Kim', era: 5.45, w: 4, l: 4, so: 42, bb: 25 },
      { name: 'Dan Park', era: 5.95, w: 3, l: 3, so: 35, bb: 22 }
    ]
  },
  dick: {
    batters: [
      { name: 'Tyler Scott', avg: .328, r: 32, hr: 2, rbi: 28, sb: 15 },
      { name: 'Jake White', avg: .305, r: 28, hr: 2, rbi: 25, sb: 12 },
      { name: 'Connor Black', avg: .288, r: 25, hr: 2, rbi: 22, sb: 10 },
      { name: 'Ryan Green', avg: .272, r: 22, hr: 1, rbi: 18, sb: 10 },
      { name: 'Mike Gray', avg: .258, r: 18, hr: 1, rbi: 15, sb: 8 },
      { name: 'Chris Brown', avg: .245, r: 15, hr: 1, rbi: 12, sb: 5 }
    ],
    pitchers: [
      { name: 'Ben Scott', era: 4.65, w: 5, l: 4, so: 58, bb: 28 },
      { name: 'Kyle White', era: 5.45, w: 4, l: 4, so: 48, bb: 25 },
      { name: 'Jack Black', era: 6.25, w: 3, l: 4, so: 42, bb: 22 },
      { name: 'Matt Green', era: 6.85, w: 2, l: 3, so: 35, bb: 18 }
    ]
  }
};

// ============================================================================
// API FUNCTIONS
// ============================================================================

const API_BASE = 'https://centennial.org/services/conf_stats.ashx';
const CURRENT_YEAR = '2025'; // Change to 2026 when season starts

async function fetchTeamStats(teamId, year = CURRENT_YEAR) {
  try {
    const url = `${API_BASE}?method=get_team_stats&team_id=${teamId}&sport=baseball&year=${year}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('API request failed');
    const data = await response.json();
    return parseTeamStatsResponse(data);
  } catch (error) {
    console.error('Failed to fetch team stats:', error);
    return null;
  }
}

function parseTeamStatsResponse(data) {
  // Parse the API response into our expected format
  // The API returns complex nested data - this extracts what we need
  if (!data) return null;

  try {
    const result = {
      batting: {
        avg: data.batting?.avg || 0,
        obp: data.batting?.obp || 0,
        slg: data.batting?.slg || 0,
        g: data.batting?.g || 0,
        r: data.batting?.r || 0,
        hr: data.batting?.hr || 0,
        sb: data.batting?.sb || 0,
        rbi: data.batting?.rbi || 0
      },
      pitching: {
        era: data.pitching?.era || 0,
        wins: data.pitching?.w || 0,
        losses: data.pitching?.l || 0,
        so: data.pitching?.so || 0,
        bb: data.pitching?.bb || 0,
        whip: data.pitching?.whip || 0,
        fldPct: data.fielding?.fldPct || 0
      },
      batters: data.batters || [],
      pitchers: data.pitchers || []
    };
    return result;
  } catch (e) {
    console.error('Failed to parse stats response:', e);
    return null;
  }
}

async function generateScoutingReport(muhStats, oppStats, oppName, perspective = 'muhlenberg') {
  // Determine which team we're writing for
  const isForMuhlenberg = perspective === 'muhlenberg';
  const forTeam = isForMuhlenberg ? 'Muhlenberg' : oppName;
  const againstTeam = isForMuhlenberg ? oppName : 'Muhlenberg';
  const forStats = isForMuhlenberg ? muhStats : oppStats;
  const againstStats = isForMuhlenberg ? oppStats : muhStats;

  const prompt = `You are an experienced college baseball scout preparing a scouting report for ${forTeam} before they face ${againstTeam}.

${forTeam.toUpperCase()} STATS (Your Team - 2025 Season):
- Batting: ${forStats.batting.avg.toFixed(3)} AVG, ${forStats.batting.obp.toFixed(3)} OBP, ${forStats.batting.slg.toFixed(3)} SLG
- Power: ${forStats.batting.hr} HR, ${forStats.batting.rbi} RBI
- Speed: ${forStats.batting.sb} SB
- Pitching: ${forStats.pitching.era.toFixed(2)} ERA, ${forStats.pitching.whip.toFixed(2)} WHIP
- Record: ${forStats.pitching.wins}-${forStats.pitching.losses}

${againstTeam.toUpperCase()} STATS (Opponent - 2025 Season):
- Batting: ${againstStats.batting.avg.toFixed(3)} AVG, ${againstStats.batting.obp.toFixed(3)} OBP, ${againstStats.batting.slg.toFixed(3)} SLG
- Power: ${againstStats.batting.hr} HR, ${againstStats.batting.rbi} RBI
- Speed: ${againstStats.batting.sb} SB
- Pitching: ${againstStats.pitching.era.toFixed(2)} ERA, ${againstStats.pitching.whip.toFixed(2)} WHIP
- Record: ${againstStats.pitching.wins}-${againstStats.pitching.losses}

Write a focused scouting report (250-350 words) for ${forTeam}'s pre-game team briefing. This report is ONLY for ${forTeam}'s coaching staff - do NOT include any advice or perspective for ${againstTeam}.

Structure it with these sections:

MATCHUP ANALYSIS
Key statistical advantages and disadvantages for ${forTeam} based on the numbers.

OFFENSIVE APPROACH
How ${forTeam} hitters should approach ${againstTeam}'s pitching staff.

PITCHING STRATEGY
How ${forTeam} pitchers should attack ${againstTeam}'s lineup. Note any hitters to pitch carefully.

OPPONENT THREATS
${againstTeam}'s most dangerous hitters/pitchers based on stats.

GAME PLAN
Specific tactical recommendations for ${forTeam}.

IMPORTANT TONE GUIDELINES:
- Write ONLY from ${forTeam}'s perspective - this is their internal scouting document
- Write in a professional, analytical tone suitable for a coaching staff briefing
- Be matter-of-fact and data-driven
- Avoid sensationalist language, dramatic metaphors, or colorful sports commentary
- Use clear, declarative statements (e.g., "Their staff walks 4.2 per 9" not "Their staff is wild")
- Focus on actionable intelligence, not storytelling
- Do NOT use markdown formatting - use plain text with section headers in ALL CAPS`;

  const response = await fetch('http://localhost:5000/api/scout-report', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ prompt })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to generate scouting report');
  }

  const data = await response.json();
  return data.report;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const formatAvg = (num) => num ? num.toFixed(3).replace(/^0/, '') : '.000';
const formatEra = (num) => num ? num.toFixed(2) : '0.00';
const formatPct = (num) => num ? (num * 100).toFixed(1) + '%' : '0.0%';

function getComparison(muhVal, oppVal, lowerIsBetter = false) {
  if (lowerIsBetter) {
    return muhVal < oppVal ? 'better' : muhVal > oppVal ? 'worse' : 'equal';
  }
  return muhVal > oppVal ? 'better' : muhVal < oppVal ? 'worse' : 'equal';
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

// Team Selector Dropdown
function TeamSelector({ value, onChange, excludeHome = true }) {
  const teams = Object.values(TEAMS).filter(t => !excludeHome || !t.isHome);

  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-[#1a1f26] border border-[#2f3a46] rounded-lg px-4 py-2 pr-10 text-gray-100 font-medium cursor-pointer hover:border-[#ff6b35] transition-colors focus:outline-none focus:border-[#ff6b35]"
      >
        {teams.map(team => (
          <option key={team.code} value={team.code}>
            {team.name} {team.mascot}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
    </div>
  );
}

// API Key Input
function ApiKeyInput({ apiKey, setApiKey }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="flex items-center gap-2 bg-[#1a1f26] border border-[#2f3a46] rounded-lg px-3 py-2">
      <Key className="w-4 h-4 text-gray-500" />
      <input
        type={visible ? 'text' : 'password'}
        placeholder="Anthropic API Key (for AI reports)"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        className="bg-transparent flex-1 outline-none text-sm text-gray-300 placeholder-gray-600 min-w-[200px]"
      />
      <button
        onClick={() => setVisible(!visible)}
        className="text-gray-500 hover:text-gray-300 transition-colors"
      >
        {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );
}

// Stats Card
function StatsCard({ title, icon: Icon, stats, type = 'batting' }) {
  const statItems = type === 'batting'
    ? [
        { label: 'AVG', value: formatAvg(stats.avg) },
        { label: 'OBP', value: formatAvg(stats.obp) },
        { label: 'SLG', value: formatAvg(stats.slg) },
        { label: 'HR', value: stats.hr },
        { label: 'RBI', value: stats.rbi },
        { label: 'SB', value: stats.sb }
      ]
    : [
        { label: 'ERA', value: formatEra(stats.era) },
        { label: 'WHIP', value: stats.whip?.toFixed(2) || '0.00' },
        { label: 'K', value: stats.so },
        { label: 'BB', value: stats.bb },
        { label: 'W-L', value: `${stats.wins}-${stats.losses}` },
        { label: 'FLD%', value: formatPct(stats.fldPct) }
      ];

  return (
    <div className="bg-[#1a1f26] rounded-xl p-4 border border-[#2f3a46]">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-5 h-5 text-[#ff6b35]" />
        <h3 className="font-semibold text-gray-100">{title}</h3>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {statItems.map(item => (
          <div key={item.label} className="text-center">
            <div className="text-xl font-bold text-gray-100">{item.value}</div>
            <div className="text-xs text-gray-500 uppercase">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Comparison Bar Chart
function ComparisonChart({ title, data, muhName = 'Muhlenberg', oppName }) {
  return (
    <div className="bg-[#1a1f26] rounded-xl p-4 border border-[#2f3a46]">
      <h3 className="font-semibold text-gray-100 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2f3a46" />
          <XAxis
            dataKey="stat"
            stroke="#8b98a5"
            tick={{ fill: '#8b98a5', fontSize: 12 }}
          />
          <YAxis
            stroke="#8b98a5"
            tick={{ fill: '#8b98a5', fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1a1f26',
              border: '1px solid #2f3a46',
              borderRadius: '8px',
              color: '#e7e9ea'
            }}
            formatter={(value, name) => [
              typeof value === 'number' && value < 1 ? value.toFixed(3) : value,
              name
            ]}
          />
          <Legend
            wrapperStyle={{ color: '#8b98a5' }}
          />
          <Bar dataKey={muhName} fill="#3b82f6" radius={[4, 4, 0, 0]} />
          <Bar dataKey={oppName} fill="#f97316" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// Player Roster Table
function PlayerRosterTable({ players, type = 'batters' }) {
  const [sortBy, setSortBy] = useState(type === 'batters' ? 'avg' : 'era');
  const [sortDir, setSortDir] = useState(type === 'batters' ? 'desc' : 'asc');

  const handleSort = (key) => {
    if (sortBy === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortDir(key === 'era' ? 'asc' : 'desc');
    }
  };

  const sortedPlayers = useMemo(() => {
    return [...players].sort((a, b) => {
      const aVal = a[sortBy] || 0;
      const bVal = b[sortBy] || 0;
      return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
    });
  }, [players, sortBy, sortDir]);

  const columns = type === 'batters'
    ? [
        { key: 'name', label: 'Player' },
        { key: 'avg', label: 'AVG' },
        { key: 'hr', label: 'HR' },
        { key: 'rbi', label: 'RBI' },
        { key: 'r', label: 'R' },
        { key: 'sb', label: 'SB' }
      ]
    : [
        { key: 'name', label: 'Player' },
        { key: 'era', label: 'ERA' },
        { key: 'w', label: 'W' },
        { key: 'l', label: 'L' },
        { key: 'so', label: 'K' },
        { key: 'bb', label: 'BB' }
      ];

  return (
    <div className="bg-[#1a1f26] rounded-xl border border-[#2f3a46] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-[#242c36]">
              {columns.map(col => (
                <th
                  key={col.key}
                  onClick={() => col.key !== 'name' && handleSort(col.key)}
                  className={`px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider ${
                    col.key !== 'name' ? 'cursor-pointer hover:text-gray-200' : ''
                  } ${sortBy === col.key ? 'text-[#ff6b35]' : ''}`}
                >
                  {col.label}
                  {sortBy === col.key && (
                    <span className="ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2f3a46]">
            {sortedPlayers.slice(0, 10).map((player, idx) => (
              <tr
                key={player.name + idx}
                className={`hover:bg-[#242c36] transition-colors ${
                  idx < 3 ? 'bg-[#1e2530]' : ''
                }`}
              >
                <td className="px-4 py-3 text-gray-100 font-medium">
                  {idx < 3 && <span className="text-[#ff6b35] mr-2">*</span>}
                  {player.name}
                </td>
                {type === 'batters' ? (
                  <>
                    <td className="px-4 py-3 text-gray-300 font-mono">{formatAvg(player.avg)}</td>
                    <td className="px-4 py-3 text-gray-300">{player.hr}</td>
                    <td className="px-4 py-3 text-gray-300">{player.rbi}</td>
                    <td className="px-4 py-3 text-gray-300">{player.r}</td>
                    <td className="px-4 py-3 text-gray-300">{player.sb}</td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-3 text-gray-300 font-mono">{formatEra(player.era)}</td>
                    <td className="px-4 py-3 text-gray-300">{player.w}</td>
                    <td className="px-4 py-3 text-gray-300">{player.l}</td>
                    <td className="px-4 py-3 text-gray-300">{player.so}</td>
                    <td className="px-4 py-3 text-gray-300">{player.bb}</td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {players.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          No player data available. Click "Refresh Stats" to load from API.
        </div>
      )}
    </div>
  );
}

// Scouting Report Modal
function ScoutingReportModal({ isOpen, onClose, report, isLoading, error, oppName, perspective }) {
  const forTeam = perspective === 'muhlenberg' ? 'Muhlenberg' : oppName;
  const againstTeam = perspective === 'muhlenberg' ? oppName : 'Muhlenberg';
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Parse report into sections for better formatting
  const parseReport = (text) => {
    if (!text) return [];
    const sections = [];
    const lines = text.split('\n');
    let currentSection = null;

    for (const line of lines) {
      const trimmed = line.trim();
      // Check if line is a section header (ALL CAPS, no punctuation at end)
      if (trimmed && trimmed === trimmed.toUpperCase() && trimmed.length > 3 && !trimmed.endsWith('.')) {
        if (currentSection) sections.push(currentSection);
        currentSection = { title: trimmed, content: [] };
      } else if (currentSection && trimmed) {
        currentSection.content.push(trimmed);
      } else if (!currentSection && trimmed) {
        // Content before first section
        if (!sections.length || sections[sections.length - 1].title !== '_intro') {
          sections.push({ title: '_intro', content: [] });
        }
        sections[sections.length - 1].content.push(trimmed);
      }
    }
    if (currentSection) sections.push(currentSection);
    return sections;
  };

  const sections = report ? parseReport(report) : [];

  return (
    <>
      {/* Print styles */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .print-content, .print-content * { visibility: visible; }
          .print-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 40px;
            background: white !important;
          }
          .no-print { display: none !important; }
        }
      `}</style>

      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
        <div className="bg-[#1a1f26] rounded-xl border border-[#2f3a46] max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
          {/* Modal Header - Dark */}
          <div className="flex items-center justify-between p-4 border-b border-[#2f3a46] no-print">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#ff6b35]" />
              <h2 className="text-lg font-semibold text-gray-100">
                Scouting Report
              </h2>
            </div>
            <div className="flex items-center gap-2">
              {report && !isLoading && (
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-3 py-1.5 bg-[#2f3a46] hover:bg-[#3d4a58] text-gray-300 rounded-lg transition-colors text-sm"
                >
                  <Printer className="w-4 h-4" />
                  Print / PDF
                </button>
              )}
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-300 transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="overflow-y-auto max-h-[calc(90vh-60px)]">
            {isLoading && (
              <div className="flex items-center justify-center py-16 bg-[#1a1f26]">
                <Loader2 className="w-8 h-8 text-[#ff6b35] animate-spin" />
                <span className="ml-3 text-gray-400">Generating scouting report...</span>
              </div>
            )}

            {error && (
              <div className="p-4 bg-[#1a1f26]">
                <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 text-red-400">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-5 h-5" />
                    <span className="font-semibold">Failed to fetch</span>
                  </div>
                  {error}
                </div>
              </div>
            )}

            {report && !isLoading && (
              <div className="print-content bg-[#faf9f7]">
                {/* Document Header */}
                <div className={`${perspective === 'muhlenberg' ? 'bg-[#8B0000]' : 'bg-[#1a365d]'} text-white px-8 py-6`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs uppercase tracking-widest text-white/70 mb-1">{forTeam} Baseball</div>
                      <h1 className="text-2xl font-bold tracking-tight">SCOUTING REPORT</h1>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-semibold">vs {againstTeam}</div>
                      <div className="text-sm text-white/70">{today}</div>
                    </div>
                  </div>
                </div>

                {/* Confidential Banner */}
                <div className="bg-[#f0eeeb] border-b border-[#d4d0c8] px-8 py-2">
                  <div className="text-xs uppercase tracking-wider text-[#666] font-medium">
                    Confidential — {forTeam} Team Use Only
                  </div>
                </div>

                {/* Report Content */}
                <div className="px-8 py-6 space-y-6">
                  {sections.map((section, idx) => (
                    <div key={idx} className={section.title === '_intro' ? '' : ''}>
                      {section.title !== '_intro' && (
                        <h2 className={`text-sm font-bold uppercase tracking-wider ${perspective === 'muhlenberg' ? 'text-[#8B0000]' : 'text-[#1a365d]'} mb-2 pb-1 border-b border-[#e5e2dc]`}>
                          {section.title}
                        </h2>
                      )}
                      <div className="text-[#333] text-[15px] leading-relaxed space-y-2">
                        {section.content.map((para, pIdx) => (
                          <p key={pIdx}>{para}</p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Document Footer */}
                <div className="px-8 py-4 bg-[#f0eeeb] border-t border-[#d4d0c8]">
                  <div className="flex items-center justify-between text-xs text-[#666]">
                    <span>Prepared for {forTeam} Baseball</span>
                    <span>Generated {today}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// Team Selection Modal
function TeamSelectModal({ isOpen, onClose, onSelect, oppName }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a1f26] rounded-xl border border-[#2f3a46] max-w-md w-full overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-[#2f3a46]">
          <h2 className="text-xl font-semibold text-gray-100 text-center">
            Generate Scouting Report
          </h2>
          <p className="text-gray-400 text-center mt-2 text-sm">
            Which team are you scouting for?
          </p>
        </div>
        <div className="p-6 space-y-3">
          <button
            onClick={() => onSelect('muhlenberg')}
            className="w-full p-4 bg-[#8B0000] hover:bg-[#a01010] text-white rounded-lg transition-colors text-left"
          >
            <div className="font-semibold text-lg">Muhlenberg</div>
            <div className="text-sm text-white/70">How to beat {oppName}</div>
          </button>
          <button
            onClick={() => onSelect('opponent')}
            className="w-full p-4 bg-[#2f3a46] hover:bg-[#3d4a58] text-gray-100 rounded-lg transition-colors text-left"
          >
            <div className="font-semibold text-lg">{oppName}</div>
            <div className="text-sm text-gray-400">How to beat Muhlenberg</div>
          </button>
        </div>
        <div className="px-6 pb-6">
          <button
            onClick={onClose}
            className="w-full p-2 text-gray-500 hover:text-gray-300 transition-colors text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// Quick Stats Comparison Grid
function QuickStatsGrid({ muhStats, oppStats, oppName }) {
  const comparisons = [
    {
      label: 'Runs/Game',
      muh: (muhStats.batting.r / muhStats.batting.g).toFixed(1),
      opp: (oppStats.batting.r / oppStats.batting.g).toFixed(1),
      better: getComparison(muhStats.batting.r / muhStats.batting.g, oppStats.batting.r / oppStats.batting.g)
    },
    {
      label: 'Home Runs',
      muh: muhStats.batting.hr,
      opp: oppStats.batting.hr,
      better: getComparison(muhStats.batting.hr, oppStats.batting.hr)
    },
    {
      label: 'Stolen Bases',
      muh: muhStats.batting.sb,
      opp: oppStats.batting.sb,
      better: getComparison(muhStats.batting.sb, oppStats.batting.sb)
    },
    {
      label: 'Team ERA',
      muh: formatEra(muhStats.pitching.era),
      opp: formatEra(oppStats.pitching.era),
      better: getComparison(muhStats.pitching.era, oppStats.pitching.era, true)
    },
    {
      label: 'Strikeouts',
      muh: muhStats.pitching.so,
      opp: oppStats.pitching.so,
      better: getComparison(muhStats.pitching.so, oppStats.pitching.so)
    },
    {
      label: 'Fielding %',
      muh: formatPct(muhStats.pitching.fldPct),
      opp: formatPct(oppStats.pitching.fldPct),
      better: getComparison(muhStats.pitching.fldPct, oppStats.pitching.fldPct)
    }
  ];

  return (
    <div className="bg-[#1a1f26] rounded-xl p-4 border border-[#2f3a46]">
      <h3 className="font-semibold text-gray-100 mb-4 flex items-center gap-2">
        <Zap className="w-5 h-5 text-[#ff6b35]" />
        Quick Comparison
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {comparisons.map(comp => (
          <div key={comp.label} className="text-center p-3 bg-[#242c36] rounded-lg">
            <div className="text-xs text-gray-500 uppercase mb-2">{comp.label}</div>
            <div className="flex items-center justify-center gap-3">
              <span className={`text-lg font-bold ${
                comp.better === 'better' ? 'text-green-400' :
                comp.better === 'worse' ? 'text-red-400' : 'text-gray-300'
              }`}>
                {comp.muh}
              </span>
              <span className="text-gray-600">vs</span>
              <span className={`text-lg font-bold ${
                comp.better === 'worse' ? 'text-green-400' :
                comp.better === 'better' ? 'text-red-400' : 'text-gray-300'
              }`}>
                {comp.opp}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================

export default function ScoutingDashboard() {
  // State
  const [selectedOpponent, setSelectedOpponent] = useState('jhu');
  const [activeTab, setActiveTab] = useState('comparison');
  const [apiKey, setApiKey] = useState('');
  const [teamStats, setTeamStats] = useState(FALLBACK_TEAM_STATS);
  const [playerRosters, setPlayerRosters] = useState(FALLBACK_PLAYERS);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [scoutingReport, setScoutingReport] = useState(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showTeamSelectModal, setShowTeamSelectModal] = useState(false);
  const [reportPerspective, setReportPerspective] = useState(null); // 'muhlenberg' or 'opponent'

  // Derived state
  const muhStats = teamStats.muh || FALLBACK_TEAM_STATS.muh;
  const oppStats = teamStats[selectedOpponent] || FALLBACK_TEAM_STATS[selectedOpponent];
  const oppTeam = TEAMS[selectedOpponent];
  const muhPlayers = playerRosters.muh || FALLBACK_PLAYERS.muh;
  const oppPlayers = playerRosters[selectedOpponent] || { batters: [], pitchers: [] };

  // Chart data
  const battingChartData = [
    { stat: 'AVG', Muhlenberg: muhStats.batting.avg, [oppTeam.name]: oppStats.batting.avg },
    { stat: 'OBP', Muhlenberg: muhStats.batting.obp, [oppTeam.name]: oppStats.batting.obp },
    { stat: 'SLG', Muhlenberg: muhStats.batting.slg, [oppTeam.name]: oppStats.batting.slg }
  ];

  const pitchingChartData = [
    { stat: 'ERA', Muhlenberg: muhStats.pitching.era, [oppTeam.name]: oppStats.pitching.era },
    { stat: 'WHIP', Muhlenberg: muhStats.pitching.whip, [oppTeam.name]: oppStats.pitching.whip }
  ];

  // Handlers
  const handleRefresh = async () => {
    setIsRefreshing(true);
    // For now, just simulate - the actual API may have CORS issues in browser
    // In production, you'd fetch from the Centennial API
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1500);
  };

  const handleGenerateReport = () => {
    // Show team selection modal first
    setShowTeamSelectModal(true);
  };

  const handleTeamSelect = async (perspective) => {
    setReportPerspective(perspective);
    setShowTeamSelectModal(false);
    setReportLoading(true);
    setReportError(null);
    setScoutingReport(null);
    setShowReportModal(true);

    try {
      const report = await generateScoutingReport(muhStats, oppStats, oppTeam.name, perspective);
      setScoutingReport(report);
    } catch (err) {
      setReportError(err.message);
    } finally {
      setReportLoading(false);
    }
  };

  const tabs = [
    { id: 'comparison', label: 'Head-to-Head', icon: TrendingUp },
    { id: 'muhlenberg', label: 'Muhlenberg', icon: Users },
    { id: 'opponent', label: 'Scout Opponent', icon: Target }
  ];

  return (
    <div className="min-h-screen bg-[#0f1419] text-gray-100">
      {/* Header */}
      <header className="bg-[#1a1f26] border-b border-[#2f3a46] sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">⚾</span>
              <div>
                <h1 className="text-xl font-bold text-gray-100">Centennial Conference</h1>
                <p className="text-sm text-gray-500">Baseball Scouting Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ApiKeyInput apiKey={apiKey} setApiKey={setApiKey} />
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-2 bg-[#ff6b35] hover:bg-[#e55a2b] disabled:opacity-50 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Refreshing...' : 'Refresh Stats'}
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-4">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[#0f1419] text-[#ff6b35] border-t border-x border-[#2f3a46]'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Comparison Tab */}
        {activeTab === 'comparison' && (
          <div className="space-y-6">
            {/* Team Matchup Header */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 py-4">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-[#8B0000] flex items-center justify-center text-2xl mb-2 mx-auto">
                  🔴
                </div>
                <h2 className="text-xl font-bold">Muhlenberg</h2>
                <p className="text-sm text-gray-500">{muhStats.pitching.wins}-{muhStats.pitching.losses}</p>
              </div>
              <div className="text-3xl font-bold text-gray-600">VS</div>
              <div className="text-center">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-2xl mb-2 mx-auto"
                  style={{ backgroundColor: oppTeam.color }}
                >
                  ⚾
                </div>
                <TeamSelector
                  value={selectedOpponent}
                  onChange={setSelectedOpponent}
                />
                <p className="text-sm text-gray-500 mt-1">{oppStats.pitching.wins}-{oppStats.pitching.losses}</p>
              </div>
            </div>

            {/* Charts */}
            <div className="grid md:grid-cols-2 gap-6">
              <ComparisonChart
                title="Batting Comparison"
                data={battingChartData}
                oppName={oppTeam.name}
              />
              <ComparisonChart
                title="Pitching Comparison"
                data={pitchingChartData}
                oppName={oppTeam.name}
              />
            </div>

            {/* Quick Stats */}
            <QuickStatsGrid muhStats={muhStats} oppStats={oppStats} oppName={oppTeam.name} />
          </div>
        )}

        {/* Muhlenberg Tab */}
        {activeTab === 'muhlenberg' && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-[#8B0000] flex items-center justify-center text-xl">
                🔴
              </div>
              <div>
                <h2 className="text-2xl font-bold">Muhlenberg Mules</h2>
                <p className="text-gray-500">2025 Season • {muhStats.pitching.wins}-{muhStats.pitching.losses}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <StatsCard
                title="Team Batting"
                icon={TrendingUp}
                stats={muhStats.batting}
                type="batting"
              />
              <StatsCard
                title="Team Pitching"
                icon={Target}
                stats={muhStats.pitching}
                type="pitching"
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Users className="w-5 h-5 text-[#ff6b35]" />
                Top Hitters
              </h3>
              <PlayerRosterTable players={muhPlayers.batters} type="batters" />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Target className="w-5 h-5 text-[#ff6b35]" />
                Pitching Staff
              </h3>
              <PlayerRosterTable players={muhPlayers.pitchers} type="pitchers" />
            </div>
          </div>
        )}

        {/* Scout Opponent Tab */}
        {activeTab === 'opponent' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
                  style={{ backgroundColor: oppTeam.color }}
                >
                  ⚾
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold">{oppTeam.name}</h2>
                    <TeamSelector value={selectedOpponent} onChange={setSelectedOpponent} />
                  </div>
                  <p className="text-gray-500">{oppTeam.mascot} • {oppStats.pitching.wins}-{oppStats.pitching.losses}</p>
                </div>
              </div>
              <button
                onClick={handleGenerateReport}
                className="flex items-center gap-2 bg-[#ff6b35] hover:bg-[#e55a2b] text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                <Zap className="w-5 h-5" />
                Generate AI Scouting Report
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <StatsCard
                title="Team Batting"
                icon={TrendingUp}
                stats={oppStats.batting}
                type="batting"
              />
              <StatsCard
                title="Team Pitching"
                icon={Target}
                stats={oppStats.pitching}
                type="pitching"
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-[#ff6b35]" />
                Dangerous Hitters
              </h3>
              <PlayerRosterTable players={oppPlayers.batters || []} type="batters" />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Target className="w-5 h-5 text-[#ff6b35]" />
                Pitching Staff
              </h3>
              <PlayerRosterTable players={oppPlayers.pitchers || []} type="pitchers" />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#1a1f26] border-t border-[#2f3a46] mt-12 py-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-500">
          <p>Data from Centennial Conference • 2025 Season</p>
          <p className="mt-1">Built for Muhlenberg Baseball 🔴⚾</p>
        </div>
      </footer>

      {/* Team Selection Modal */}
      <TeamSelectModal
        isOpen={showTeamSelectModal}
        onClose={() => setShowTeamSelectModal(false)}
        onSelect={handleTeamSelect}
        oppName={oppTeam.name}
      />

      {/* Scouting Report Modal */}
      <ScoutingReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        report={scoutingReport}
        isLoading={reportLoading}
        error={reportError}
        oppName={oppTeam.name}
        perspective={reportPerspective}
      />
    </div>
  );
}
