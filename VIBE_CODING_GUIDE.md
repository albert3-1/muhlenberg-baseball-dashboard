# Vibe Coding: How I Built This Baseball Dashboard (And How You Can Build Stuff Too)

Hey Ian - I made this guide to explain how I built the scouting dashboard you just saw. The cool thing is: **I don't know how to code either.** I just described what I wanted, and an AI helped me build it. That's called "vibe coding," and you can do it too.

---

## What is Vibe Coding?

Vibe coding is building software by having a conversation. You describe what you want in plain English, an AI writes the code, you test it, tell it what's wrong or what to add, and repeat until it works.

Think of it like this: imagine you had a friend who's a really good programmer, and they're sitting next to you. You say "I want a website that shows baseball stats," and they start building it. You look at what they made and say "that's cool, but can you add a chart comparing two teams?" They do it. "Actually, make the Muhlenberg bar red." Done.

That's vibe coding. The AI is that programmer friend.

**You don't need to know:**
- Programming languages
- How websites work
- Any technical stuff

**You do need to know:**
- What you want to build
- How to describe it clearly
- When something looks wrong

---

## What is Claude Code?

Claude Code is the tool I used. It's an AI that:
- Reads your project files
- Writes code based on what you describe
- Runs the code so you can see if it works
- Fixes problems when you tell it something's broken

The whole process is just a conversation. You type what you want, Claude does it, you react to what you see, repeat.

---

## Quick Vocab (Just So You Know the Words)

You don't need to understand these deeply - just know what they mean so you can use them when describing what you want:

- **Python** - a programming language (I used it for grabbing stats from websites)
- **React** - a tool for making interactive web pages (the dashboard uses this)
- **API** - how programs talk to each other (like when the dashboard asks Claude to write a scouting report)
- **Frontend** - the stuff you see and click on
- **Backend** - the behind-the-scenes stuff that makes it work
- **Scraping** - automatically pulling data from websites

That's it. You don't need to know more than that.

---

## How I Actually Built This Dashboard

Let me walk you through my actual process. This wasn't one big prompt - it was a bunch of conversations over time, building piece by piece.

### Step 1: The Idea

I wanted something useful for you and the Muhlenberg baseball team. I thought: what if there was a dashboard where you could compare your team's stats against any opponent in the conference, and even generate a scouting report before games?

That was the whole idea. I didn't plan out the technical stuff - I just knew what I wanted it to *do*.

### Step 2: Getting the Stats (The Scraper)

**What I told Claude:**
> "I want to grab baseball statistics from all 10 Centennial Conference team websites. Each team has a stats page. I need batting stats like batting average, home runs, RBIs, and pitching stats like ERA and strikeouts."

Claude wrote a Python script that goes to each team's website and pulls the stats automatically.

**Then I tested it and said:**
> "Some players only have like 2 at-bats. Can you ignore players who don't have enough playing time? Like at least 30 at-bats for hitters."

Claude updated it. That's the whole process - describe, test, refine.

### Step 3: The Dashboard (The Visual Part)

**What I told Claude:**
> "Build me a dashboard where I can pick an opponent from a dropdown, and it shows charts comparing Muhlenberg vs that team. Show batting average, on-base percentage, and slugging for hitting. Show ERA for pitching."

Claude built the basic version. Then I kept refining:

> "Make it dark mode - like a dark background with lighter text."

> "Add Muhlenberg's red color for our team's bars in the chart."

> "Show a table of all the players with their stats. Let me click the column headers to sort."

> "The top players should stand out somehow - maybe put a star next to the top 3."

Each time, I was just reacting to what I saw and describing what I wanted different.

### Step 4: The Scouting Reports (The AI Part)

This was the coolest part. I wanted the dashboard to generate actual scouting reports using AI.

**What I told Claude:**
> "Add a button that generates a scouting report. It should analyze both teams' stats and give advice for the game - like what to watch out for, how to approach their pitching, who their dangerous hitters are."

Claude set it up so when you click the button, it sends the stats to the Claude AI, which writes a custom report.

**Then I refined it:**
> "I want to be able to generate the report from either team's perspective. Like, show me what Muhlenberg's scouting report would say, OR what the opponent's report on us would say."

> "Make the report look more professional - like an actual document with sections and a header."

> "Add a print button so coaches can print it out."

### Step 5: Fixing Stuff When It Broke

Things broke constantly. That's normal. Here's how I handled it:

**When I saw an error:**
> "I'm getting this error: [pasted the error message]. Can you fix it?"

**When something looked wrong:**
> "The chart is showing but the numbers look off - Johns Hopkins shows 0 for everything."

**When it didn't do what I expected:**
> "The report is giving advice to both teams. It should only be from Muhlenberg's perspective when I pick Muhlenberg."

I didn't need to understand *why* things broke. I just described what I was seeing, and Claude figured out the fix.

---

## How to Prompt (Tips from My Experience)

### Say What You Want, Not How to Build It

**Good:** "I want a chart comparing the two teams' batting averages"

**Unnecessary:** "Create a React component using the Recharts library with a BarChart..."

You don't need to tell it the technical approach. Just describe the end result.

### Be Specific About What You're Seeing

**Good:** "The chart shows up but the labels are cut off on the right side"

**Too vague:** "The chart looks weird"

The more specific you are, the faster Claude can fix it.

### Describe the Experience You Want

**Good:** "When I click Generate Report, I want a popup that asks which team's perspective, then shows a loading spinner, then shows the report"

This helps Claude understand the full flow, not just one piece.

### Build One Thing at a Time

Don't try to describe the whole project in one message. Start small:
1. First, just get the basic stats showing
2. Then add the charts
3. Then add the player tables
4. Then add the scouting report

Each piece builds on the last.

### When Something Breaks, Just Describe It

Copy the error message. Or describe what happened vs what you expected:

> "I clicked the button and nothing happened. It should show a popup."

> "The page is blank now. It was working before I asked you to add the print button."

---

## How to Start Your Own Project

### 1. Pick Something You Actually Care About

The best projects solve a real problem for you. I built this because I wanted to give you something useful for baseball. What would make *your* life easier or more fun?

### 2. Start Stupid Simple

Don't try to build a huge thing. Start with the smallest version:
- Want a workout tracker? Start with: "Build a page where I can type in my lifts and save them"
- Want a study planner? Start with: "Show my class schedule in a list"

You can always add more later.

### 3. Open Claude Code and Just Start Talking

Your first message can be something like:

> "I want to build [thing]. I have no coding experience. Can you help me get started with something simple?"

Then just react to what it builds. "That's cool, but can you also..." or "That's not quite what I meant, I wanted..."

### 4. Test Everything

After Claude makes changes, actually look at what it built. Click around. Try to break it. The more you test, the more feedback you can give.

### 5. Don't Be Afraid to Say "That's Wrong"

Claude isn't perfect. Sometimes it misunderstands. Just say:

> "That's not what I meant. I wanted [clarify]."

> "This broke something - now [describe problem]."

It's a conversation. Keep going until it's right.

---

## Project Ideas (If You Need Inspiration)

**Baseball stuff:**
- Personal stats tracker - log your at-bats and see your running average
- Pitch tracking - record what pitches you see from each pitcher to find patterns
- Workout log - track your lifting, throwing program, conditioning
- Recruiting profile page - a clean page with your stats and highlights to send coaches

**School/life stuff:**
- Study schedule builder - block out time for each class based on difficulty
- Budget tracker - log what you spend and see where your money goes
- Roommate chores - rotate responsibilities and check them off

**Whatever you're into:**
- Fantasy sports analyzer
- Playlist organizer
- Recipe saver
- Anything, really

---

## The Main Thing to Remember

You don't need to become a programmer. You just need to be able to describe what you want and react to what you get. That's vibe coding.

I built this whole dashboard - scraping stats from 10 teams, charts, tables, AI scouting reports, print functionality - and I don't know how any of the code actually works. I just kept describing what I wanted until it existed.

You can do the same thing. Pick something you care about and start talking to Claude. See what happens.

---

*Built with Claude Code - just vibes, no coding required.*
