# How to Put Your Project on GitHub

This guide walks you through putting your code on GitHub so you can share it, access it from anywhere, and show people what you built.

---

## What is GitHub?

GitHub is like Google Drive for code. It stores your project online, keeps track of every change you make, and lets you share it with others. When you hear developers talk about their "repo" (short for repository), they mean their project folder on GitHub.

---

## One-Time Setup (You Only Do This Once)

### 1. Create a GitHub Account

1. Go to [github.com](https://github.com)
2. Click **Sign Up**
3. Use your email, create a username and password
4. Verify your email

That's it - you have a GitHub account.

### 2. Install Git on Your Computer

Git is the tool that talks to GitHub. You need it installed.

**Check if you already have it:**
1. Open Terminal (Mac) or Command Prompt (Windows)
2. Type: `git --version`
3. If you see a version number, you're good. If not, install it:

**To install:**
- **Windows:** Download from [git-scm.com](https://git-scm.com/download/win) and run the installer (just click Next through everything)
- **Mac:** Open Terminal and type `git`. It will prompt you to install developer tools - click Install

### 3. Tell Git Who You Are

Open Terminal/Command Prompt and run these two commands (use your own name and email):

```
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

Use the same email you used for GitHub.

---

## Putting Your Project on GitHub

### Step 1: Create a New Repository on GitHub

1. Go to [github.com](https://github.com) and log in
2. Click the **+** button in the top right corner
3. Click **New repository**
4. Fill in:
   - **Repository name:** `centennial-baseball-dashboard` (or whatever you want to call it)
   - **Description:** "Baseball scouting dashboard for Centennial Conference" (optional but helpful)
   - **Public or Private:**
     - Public = anyone can see it
     - Private = only you (and people you invite) can see it
   - Leave everything else as default
5. Click **Create repository**

You'll see a page with some commands - keep this page open.

### Step 2: Initialize Git in Your Project Folder

Open Terminal/Command Prompt and navigate to your project folder:

**Windows (Command Prompt or PowerShell):**
```
cd "C:\Users\jlevi\Documents\Claude Code\Ian Demo"
```

**Mac/Linux:**
```
cd ~/Documents/Claude\ Code/Ian\ Demo
```

Now initialize git:
```
git init
```

This tells git to start tracking this folder.

### Step 3: Create a .gitignore File

There are some files you don't want to upload (like your API keys). Create a file called `.gitignore` in your project folder with this content:

```
# Don't upload these
.env
__pycache__/
*.pyc
node_modules/
.DS_Store
```

The `.env` file has your API key in it - you never want that on GitHub.

### Step 4: Add Your Files

Tell git which files to track:

```
git add .
```

The `.` means "all files" (except the ones in .gitignore).

### Step 5: Create Your First Commit

A commit is like a save point. You're saving the current state of your project:

```
git commit -m "Initial commit - baseball scouting dashboard"
```

The `-m` part is your message describing what this save point contains.

### Step 6: Connect to GitHub

Now link your local folder to the GitHub repository you created. Copy the commands from the GitHub page, or use these (replace with your username and repo name):

```
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/centennial-baseball-dashboard.git
git push -u origin main
```

It might ask for your GitHub username and password.

**Note:** GitHub now uses "Personal Access Tokens" instead of passwords. If it asks for a password and yours doesn't work:
1. Go to GitHub → Settings → Developer Settings → Personal Access Tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a name, select "repo" permissions, click Generate
4. Copy the token and use it as your password

### Step 7: Check That It Worked

Go to your GitHub repository page (github.com/YOUR-USERNAME/centennial-baseball-dashboard) and refresh. You should see all your files there.

---

## Making Updates Later

After you make changes to your project, here's how to update GitHub:

### 1. See What Changed
```
git status
```
This shows you which files were modified.

### 2. Add the Changes
```
git add .
```

### 3. Commit with a Message
```
git commit -m "Added new feature"
```

Write a short message describing what you changed.

### 4. Push to GitHub
```
git push
```

That's it. Your changes are now on GitHub.

---

## Quick Reference (Commands You'll Use Often)

| What you want to do | Command |
|---------------------|---------|
| See what files changed | `git status` |
| Add all changes | `git add .` |
| Save changes (commit) | `git commit -m "your message"` |
| Upload to GitHub | `git push` |
| Download latest from GitHub | `git pull` |

---

## Sharing Your Project

Once it's on GitHub, you can share it by sending people the link:

```
https://github.com/YOUR-USERNAME/centennial-baseball-dashboard
```

If it's public, anyone with the link can see your code. If it's private, you need to invite them:
1. Go to your repo on GitHub
2. Click **Settings** → **Collaborators**
3. Click **Add people** and enter their GitHub username

---

## Common Issues and Fixes

### "Permission denied" or authentication errors
You probably need a Personal Access Token (see Step 6 above).

### "Repository not found"
Double-check the URL. Make sure you created the repo on GitHub first.

### "Failed to push - rejected"
Someone else (or you on another computer) made changes. Run `git pull` first, then `git push`.

### Accidentally uploaded your .env file
1. Delete it from GitHub (or delete the whole repo and start over)
2. Make sure `.env` is in your `.gitignore` file
3. **Change your API key immediately** - once it's been on GitHub, consider it compromised

---

## Summary

1. Create GitHub account
2. Install git
3. Create a repo on GitHub
4. In your project folder: `git init` → `git add .` → `git commit -m "message"` → `git push`
5. To update later: `git add .` → `git commit -m "message"` → `git push`

That's all there is to it. Your project is now backed up, shareable, and you look like a real developer.

---

*Pro tip: Making lots of small commits with clear messages is better than one giant commit. It's like saving your game often.*
