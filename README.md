# C++ Crash Course — UChicago FINM 326

Interactive tutorial covering all 8 lectures of Computing for Finance in C++.

## Deploy to GitHub Pages (5 steps)

### 1. Create a GitHub repo
- Go to [github.com/new](https://github.com/new)
- Name it anything (e.g., `cpp-crash-course`)
- Make it **Public**
- Do NOT add README/gitignore (we already have them)
- Click **Create repository**

### 2. Push this code
Open Command Prompt in this folder and run:
```
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/cpp-crash-course.git
git push -u origin main
```
(Replace `YOUR_USERNAME` with your actual GitHub username)

### 3. Enable GitHub Pages
- Go to your repo on GitHub
- Click **Settings** → **Pages** (in the left sidebar)
- Under **Source**, select **GitHub Actions**
- That's it — no other settings needed

### 4. Wait ~2 minutes
The GitHub Action automatically builds and deploys. You can watch progress in the **Actions** tab.

### 5. Visit your site
Your site will be live at:
```
https://YOUR_USERNAME.github.io/cpp-crash-course/
```

## Run locally
```
npm install
npm run dev
```
