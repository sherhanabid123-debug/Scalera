# Scalera

**Live site:** [https://www.scalera.in](https://www.scalera.in)

Web design agency site with an AI-powered site builder. The frontend is the agency's marketing site (services, portfolio, process, testimonials); the backend generates full websites from a brief using templates and an LLM.

## Tech stack

**Frontend**
- React 19 + Vite
- Three.js / React Three Fiber for 3D visuals
- GSAP for animation
- Lenis for smooth scroll

**Backend**
- FastAPI (Python)
- Groq (LLM generation)
- Deployed as a Vercel serverless function (`api/index.py`)

## Project structure

```
src/
  components/
    layout/      Navbar, Footer
    sections/    Hero, Services, Portfolio, Process, FAQ, Testimonials, etc.
    canvas/      3D background components
    legal/       Legal page content
  utils/         Formatting and performance helpers
  App.jsx        Main site entry
  builder-main.jsx   Entry for the AI builder page
  legal-main.jsx      Entry for the legal page

backend/
  main.py            FastAPI app
  engine/             Site generation logic (assembler, generator, component library)
  templates/          Website templates the generator builds from (agency, restaurant, saas, etc.)

public/               Static assets served as-is
scripts/dev/          Local development and debugging scripts (not used in production)
```

## Getting started

**Frontend**
```bash
npm install
npm run dev
```

**Backend**
```bash
pip install -r backend/requirements.txt
uvicorn backend.main:app --reload
```

You'll need a `.env` file based on `.env.example` for backend API keys.

## Build

```bash
npm run build
```

## Linting

```bash
npm run lint
```

## Deployment

Deployed on Vercel — the frontend builds statically and the backend runs as a Python serverless function (see `vercel.json`).
