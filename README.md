# LetterAI Assistant


> AI-powered assistant that generates personalized, professional letters and emails through a guided workflow.

Generate high-quality correspondence in minutes with support for **English & Hindi**, multiple writing tones, editable output, and AI-powered requirement analysis.

---

## Features

- AI-powered requirement analysis
- Dynamic contextual questions
- Professional letter & email generation
- English & Hindi language support
- Automatic tone recommendation
- Real-time editable preview
- One-click copy
- Regenerate with updated responses
- Fast and responsive interface

---

## How It Works

LetterAI follows a simple three-step workflow.

### Step 1 — Describe your request

Enter a description of the letter or email you want, or choose from preset templates.

The AI automatically:
- Identifies the correspondence type
- Suggests the most appropriate writing tone
- Prepares personalized questions

### Step 2 — Answer the questions

The AI generates contextual questions based on your request — things like applicant name, company, leave dates, purpose, and experience. Questions are tailored for every correspondence type.

### Step 3 — Get your letter

After collecting your information, the AI generates:
- A professional English version
- A Hindi translation
- Editable, copy-ready output

---

## Workflow

```
User Request → Analyze Requirements → Generate Questions → Collect Answers → Generate Letter
                                                                                    ↓
                                                                          English + Hindi output
                                                                          Edit • Regenerate • Copy
```

---

## Supported Correspondence

| Category | Types |
|---|---|
| Professional | Leave application, Job application, Cover letter, Resignation letter, Recommendation letter, Business letter |
| Communication | Complaint letter, Apology letter, Thank-you letter, Invitation letter, Request letter, Appreciation letter |
| Email | Official email, Personal email |

---

## Language Support

| Language | Role |
|---|---|
| 🇬🇧 English | Primary output |
| 🇮🇳 Hindi | Auto-translated |

---

## Quick Start

**Prerequisites:** Node.js v16+, npm or yarn, an AI API key.

```bash
# Clone the repo
git clone <repository-url>
cd letterai-assistant

# Install dependencies
npm install

# Configure environment
echo "AI_API_KEY=your_api_key" > .env

# Start the development server
npm run dev
```

---

## Project Structure

```
letterai-assistant/
├── client/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   └── styles/
├── server/
│   ├── routes/
│   ├── services/
│   └── controllers/
├── shared/
├── public/
├── package.json
└── README.md
```

---

## API Reference

### Analyze requirements

```http
POST /api/analyze-requirements
```

**Request**
```json
{
  "prompt": "I need a leave application."
}
```

**Response**
```json
{
  "type": "Leave Application",
  "tone": "Professional",
  "questions": ["Employee Name", "Leave Start Date", "Leave End Date", "Reason"]
}
```

### Generate correspondence

```http
POST /api/generate-correspondence
```

**Request**
```json
{
  "answers": {
    "Employee Name": "John Doe",
    "Reason": "Medical Leave"
  }
}
```

**Response**
```json
{
  "english": "...",
  "hindi": "...",
  "tone": "Professional"
}
```

---

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS, Motion, Lucide React |
| Backend | Node.js, Express.js, Generative AI API |
| Build tools | tsx, esbuild, ESLint, dotenv, Autoprefixer |

---
