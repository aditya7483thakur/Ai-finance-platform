# 💰 Budgetly

**Budgetly** is a personal finance management platform that helps users track income and expenses, set budgets, and receive intelligent financial emails.

# 📽️ Demo

🎬 [Watch the Demo Video](https://www.youtube.com/watch?v=YOUR_VIDEO_ID)  
🌐 [Live App](https://budgetly-sandy.vercel.app/)

## 🚀 Features

- 📅 **Recurring & One-Time Transactions**
- 🔔 **Automated Budget Alerts** (when usage exceeds 90%)
- 📬 **Monthly Summary Emails** with Gemini-generated financial tips
- 📸 **Receipt Scanning** using Google Gemini API
- 🕒 **Scheduled Cron Jobs** using cron-job.org
- 🔐 **Authentication** via Clerk
- 🌐 **REST API** built with Express and Prisma

## 🛠️ Tech Stack

- **Frontend**: React.js, ShadCn UI, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL, Prisma ORM
- **Authentication**: Clerk
- **AI Integration**: Google Gemini API
- **Email Service**: Nodemailer (Gmail)

# 🛠️ Local Setup

Follow these steps to get Budgetly running locally:

### 1. Clone the Repository

```bash
git clone https://github.com/aditya7483thakur/Ai-finance-platform
cd Ai-finance-platform
```

### 2. Project Structure
After cloning, you'll see two main folders:

```bash
budgetly/
├── client/   # Frontend (React)
└── server/   # Backend (Express + Prisma)
```

### 3. Open Two Terminals
Use two terminals or split your terminal window to run both frontend and backend simultaneously.

Terminal 1: Frontend
```bash
cd client
npm install
```
Terminal 2: Backend
```bash
cd client
npm install
```

### 4. Environment Variables
Create a .env file in the root of both client/ and server/ directories.

Refer to the provided .env.example files in each folder to know which environment variables are needed.


```bash
# In client/.env
# Refer to client/.env.example

# In server/.env
# Refer to server/.env.example
```
Make sure to fill in the necessary values (e.g., API keys, database URLs, Clerk credentials, Gmail credentials, etc.).

### 5. Run the App
Once environment variables are set up and dependencies are installed, start both the client and server.

Frontend
```bash
npm run dev
```
Backend
```bash
npm run dev
```
Now Budgetly should be running locally with both the frontend and backend active. 🎉


---

Let me know when you're ready to add API docs, contributing guidelines, or badges!
