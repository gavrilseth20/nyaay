# Nyaay

> India-native AI bias auditor. Counterfactual twin tests for caste, religion, regional, and gender bias in algorithmic decision systems.

Built for **Google Solution Challenge 2026** — problem statement *Unbiased AI Decision*.

---

## Why this exists

The fairness libraries everyone uses today — **IBM AIF360, Microsoft Fairlearn, Google What-If Tool** — encode US protected attributes (race, age, gender). They have no native concept of caste, no understanding of pincode-as-religion-proxy, no Indian language fluency signal.

Nyaay is built around those.

It generates *counterfactual twin* applicant pairs — identical in merit but differing on a single demographic signal (caste-linked surname, religion-via-pincode proxy, region, language, or gender) — sends both to the target AI model, and measures the decision divergence with statistical confidence.

Output: defensible compliance evidence mapping to **DPDP Act 2023, RBI Fair Practices Code, and EU AI Act Article 10**.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  Auditor / Compliance Officer (browser)                          │
└────────────────────────────┬─────────────────────────────────────┘
                             │
┌────────────────────────────▼─────────────────────────────────────┐
│  Frontend  ·  React 18 + Vite + Tailwind + Framer Motion         │
│  Deployed on Vercel                                              │
└──────┬──────────────────────────────────────┬───────────────────┘
       │                                      │
┌──────▼──────────┐                ┌──────────▼──────────────────┐
│ Clerk SSO       │                │ Backend API · Express        │
│ (Google login)  │                │ Firebase Admin SDK           │
└─────────────────┘                └────┬─────────────────────────┘
                                        │
              ┌─────────────────────────┼──────────────────────────┐
              │                         │                          │
   ┌──────────▼──────────┐  ┌───────────▼────────────┐  ┌─────────▼──────────┐
   │ Cloud Firestore     │  │ ML Service · FastAPI   │  │ Target Model APIs  │
   │ Firebase Storage    │  │ Twin Generator         │  │ - Ollama (local)   │
   │ Firebase Auth       │  │ Statistical Engine     │  │ - Gemini API       │
   │ (Google Cloud)      │  │ pandas · numpy · scipy │  │ - Custom endpoint  │
   └─────────────────────┘  └────────────────────────┘  └────────────────────┘
```

---

## Project structure

```
nyaay/
├── frontend/              React + Vite + Tailwind + Framer Motion + Recharts
├── backend/               Node.js + Express + Firebase Admin SDK
├── ml-service/            FastAPI + pandas + numpy + scipy
├── firebase.json          Firebase Hosting / Firestore / Storage rules config
├── firestore.rules        Firestore access rules
└── storage.rules          Storage access rules
```

---

## Quick start

### Frontend
```bash
cd frontend
npm install
npm run dev          # http://localhost:5173
```

Optional `frontend/.env`:
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_API_BASE=http://localhost:8080/api
```
If `VITE_CLERK_PUBLISHABLE_KEY` is missing, the prototype falls back to a local demo login so the UI still runs.

### Backend
```bash
cd backend
npm install
npm run dev          # http://localhost:8080
```

`backend/.env`:
```env
ALLOW_DEMO_AUTH=true
PORT=8080
CORS_ORIGIN=http://localhost:5173
ML_SERVICE_URL=http://localhost:8000

# Optional — only if auditing against Ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2

# Optional — production Firebase + Clerk
CLERK_SECRET_KEY=
CLERK_PUBLISHABLE_KEY=
FIREBASE_PROJECT_ID=
FIREBASE_STORAGE_BUCKET=
FIREBASE_SERVICE_ACCOUNT_JSON=
```

### ML Service
```bash
cd ml-service
python -m venv .venv
.venv\Scripts\activate           # Windows
# source .venv/bin/activate      # macOS / Linux
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Auditing against Ollama (local Llama)
```bash
ollama pull llama3.2
ollama serve
```
Then open `/live-audit` in the frontend, choose **Ollama** as the provider, define your schema, and run a twin test.

### Auditing against Gemini / OpenAI / Claude / custom models
Use the **Custom API** provider on `/live-audit`. Paste the endpoint, headers JSON, request body template, and response text path. Placeholders `{{prompt}}` and `{{profileJson}}` are interpolated at request time.

---

## Tech stack

| Layer | Stack |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion, Recharts, Lucide, Clerk |
| Backend | Node.js, Express, Firebase Admin SDK |
| ML service | FastAPI, pandas, NumPy, SciPy |
| AI / target models | Gemini API (`google-genai`), Ollama (Llama 3.2 / 3.1 / Phi-3), OpenAI / Anthropic / custom HTTP |
| Cloud | Vercel (frontend), Cloud Firestore, Firebase Storage, Firebase Auth |
| Auth | Clerk SSO (Google) with Firebase Auth fallback |
| Reports | jsPDF, html2canvas, xlsx |

---

## Routes

| Path | Purpose |
|---|---|
| `/` | Landing — animated twin-divergence demo |
| `/auth` | Clerk login + register (demo fallback) |
| `/dashboard` | Audit overview, severity heatmap, activity feed |
| `/upload` | CSV/XLS upload, column mapping, counterfactual disparity check |
| `/configure` | Configure and launch a full audit |
| `/results/:auditId` | Statistical findings, twin-diff hero, raw twin pairs |
| `/remediation/:auditId` | Prioritised fix list with effort × impact |
| `/reports` | Compliance report preview, PDF / JSON / CSV export |
| `/monitor` | Continuous drift monitor, audit history |
| `/live-audit` | Real-time twin test against any AI model |
| `/settings` | Organisation profile, API keys |

---

## Solution Challenge alignment

| Requirement | How Nyaay meets it |
|---|---|
| Cloud deployment | Frontend deployed on Vercel; Firestore + Storage on Google Cloud |
| Google AI / service | Gemini API integration via `/live-audit`; Cloud Firestore, Firebase Storage, Firebase Auth |
| Real-world problem | Algorithmic discrimination by Indian decision-system AI (lending, hiring, insurance, rentals) |
| Working prototype | Live `/live-audit` runs counterfactual twin tests against Ollama and any custom endpoint |

---

## Methodology — what we are honest about

- The **counterfactual twin** approach has known limitations around path-specific causal effects and mediator confounding. We treat it as evidence, not proof.
- Statistical significance requires sample sizes Nyaay can hit at scale (1k–10k twins) — single-digit pilots are illustrative, not conclusive.
- The Indian Bias Layer (54 surnames × 12 communities, 20 pincodes × 17 cities in the seed dataset) is sufficient to demonstrate the methodology; production use requires expansion to thousands of validated entries.
- DPDP / RBI / EU AI Act mappings in the report layer are aligned to the specific articles; the engine flags risks against the relevant control text but does not provide legal advice.

---

## License

- Code: **MIT**
- Indian Bias Layer dataset: **CC-BY-4.0**

---

## Team

- **Nyaay** · solo build · Solution Challenge 2026
- Problem statement: *Unbiased AI Decision*
