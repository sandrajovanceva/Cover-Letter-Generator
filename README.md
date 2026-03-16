# AI Resume & Cover Letter Generator (ApplyCraft)

AI-powered SaaS-style web app that helps users generate tailored cover letters and improve their resumes for specific job postings.

Built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, **Supabase Auth + Postgres**, **OpenAI**, **Zod**, and **shadcn-inspired UI components**.

---

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS
- **UI**: shadcn-style components (Button), Lucide icons
- **Forms & Validation**: React Hook Form, Zod
- **Backend**: Next.js Route Handlers (`app/api/*`)
- **Auth & Database**: Supabase (Auth + Postgres)
- **AI**: OpenAI API (chat completions)
- **File parsing**: `pdf-parse` for PDF, simple fallback message for DOCX

---

## Core Features

- **Resume input**
  - Paste resume text directly
  - Upload PDF / DOCX (PDF is parsed to text; DOCX shows a helpful fallback)
- **Job description input**
  - Paste a full job posting
- **AI cover letter generation**
  - Tailored cover letter using resume + job description
  - Professional, modern tone
- **Resume optimization suggestions**
  - Concrete, prioritized suggestions for:
    - Missing or under-emphasized skills
    - Stronger, outcome-driven bullet points
    - Better keyword alignment with the posting
- **Editor workspace**
  - Edit the generated cover letter
  - Copy to clipboard
  - Download as `.txt`
- **Auth & persistence**
  - Supabase Auth (email + password)
  - Store resumes, job descriptions, and generated cover letters in Postgres

---

## Project Structure

```text
app/
  layout.tsx           # Global layout (landing + auth + app)
  globals.css          # Tailwind + base styles
  page.tsx             # Marketing / landing page
  app/
    layout.tsx         # Authenticated app shell (top nav, container)
    page.tsx           # Main generator workspace (resume + JD + results)
  login/
    page.tsx           # Login page
  signup/
    page.tsx           # Signup page
  api/
    generate/route.ts  # AI generation (cover letter + suggestions)
    parse-resume/route.ts # PDF/DOCX parsing endpoint

components/
  ui/
    button.tsx         # shadcn-style button

features/
  (room for future: resume history, job history, saved letters, etc.)

lib/
  utils.ts             # `cn` helper (clsx + tailwind-merge)
  openai.ts            # OpenAI client + prompt logic
  validators.ts        # Zod schemas (generate request)
  supabase/
    client.ts          # Browser Supabase client (Auth + DB)
    server.ts          # Server Supabase client for Route Handlers

supabase-schema.sql    # Database & RLS setup for Supabase
tailwind.config.ts     # Tailwind configuration
postcss.config.mjs     # PostCSS config
tsconfig.json          # TypeScript config
next.config.mjs        # Next.js config
package.json           # Dependencies & scripts
.env.example           # Required environment variables
```

---

## Database Schema (Supabase / Postgres)

`supabase-schema.sql` defines the schema and row-level security policies.

### Tables

- **users**
  - `id` (uuid, primary key) — in practice, use `auth.users` as the source of truth
  - `email` (text)
  - `created_at` (timestamptz)

- **resumes**
  - `id` (bigserial, primary key)
  - `user_id` (uuid, references `auth.users.id`)
  - `resume_text` (text)
  - `created_at` (timestamptz)

- **job_descriptions**
  - `id` (bigserial, primary key)
  - `user_id` (uuid, references `auth.users.id`)
  - `job_text` (text)
  - `created_at` (timestamptz)

- **cover_letters**
  - `id` (bigserial, primary key)
  - `user_id` (uuid, references `auth.users.id`)
  - `resume_id` (bigint, references `resumes.id`)
  - `job_id` (bigint, references `job_descriptions.id`)
  - `generated_text` (text)
  - `created_at` (timestamptz)

### Row-Level Security Policies

- RLS is enabled on:
  - `resumes`
  - `job_descriptions`
  - `cover_letters`
- Policies limit access so users can only manage rows where `user_id = auth.uid()`.

Apply the schema in Supabase:

1. Go to Supabase project → SQL
2. Paste the contents of `supabase-schema.sql`
3. Run the script

---

## Environment Variables

Create a `.env.local` file in the project root (Next.js will load this automatically):

```bash
cp .env.example .env.local
```

Then fill in:

- **`NEXT_PUBLIC_SUPABASE_URL`** — from Supabase project settings (API)
- **`NEXT_PUBLIC_SUPABASE_ANON_KEY`** — from Supabase project settings (API, anon key)
- **`OPENAI_API_KEY`** — from your OpenAI account

---

## OpenAI Setup

1. Create an OpenAI account if you don’t have one.
2. Generate an API key.
3. Put it in `.env.local` as `OPENAI_API_KEY`.

The app uses `gpt-4.1-mini` via the `openai` SDK and returns structured JSON with:

```ts
{
  coverLetter: string;
  suggestions: string[];
}
```

Prompt engineering lives in `lib/openai.ts`.

---

## Supabase Setup

1. Go to [Supabase](https://supabase.com/) and create a new project.
2. Note your:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. In the SQL editor, run `supabase-schema.sql`.
4. Ensure **Email** auth is enabled in **Authentication → Providers**.

The app uses `@supabase/auth-helpers-nextjs` to:

- Get the user in API routes
- Store and send auth cookies automatically

---

## Running the Project Locally

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
# then edit .env.local with your Supabase + OpenAI values
```

### 3. Run the dev server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

---

## Application Flow

### 1. Landing page (`/`)

- Marketing-style hero
- Feature highlights
- CTA to log in / sign up

### 2. Auth

- `/login` — email + password
- `/signup` — email + password
- On success → redirect to `/app`

> Note: In a production deployment, you may also want to wire up Supabase’s email confirmations and handle the “confirm email” step explicitly.

### 3. Generator workspace (`/app`)

Left column:

- **Resume input**
  - Upload PDF / DOCX → `/api/parse-resume` parses the file
    - PDF: parsed to text via `pdf-parse`
    - DOCX: currently returns a message suggesting paste/PDF (stub for future parser)
  - Or directly paste resume text into the textarea
- **Job description input**
  - Paste a full job posting
- **Generate button**
  - Calls `/api/generate` with `resumeText` and `jobText`
  - Uses Zod for validation

Right column:

- **Cover letter editor**
  - Editable textarea with the generated letter
  - Copy to clipboard
  - Download as `.txt`
- **Resume optimization suggestions**
  - Ordered list of concrete suggestions from the AI

---

## API Endpoints

### `POST /api/generate`

- **Auth required** (Supabase cookie via `createSupabaseServerClient`)
- Request body:

```json
{
  "resumeText": "string",
  "jobText": "string"
}
```

- Validation:
  - `resumeText`: min 50 chars
  - `jobText`: min 50 chars
- Behavior:
  - Calls OpenAI with resume + job description
  - Parses JSON response into `{ coverLetter, suggestions }`
  - Stores:
    - `resumes` row
    - `job_descriptions` row
    - `cover_letters` row
  - Returns the generated content

### `POST /api/parse-resume`

- Multipart form-data with field `file`
- Supported:
  - PDF → parsed with `pdf-parse`
  - DOCX → returns a helpful message (stub; real parsing is more involved)
- Response:

```json
{
  "text": "parsed or fallback text"
}
```

---

## Production Readiness Notes

- **Scalability**
  - Stateless Next.js API routes
  - Supabase handles auth + Postgres at scale
  - OpenAI used via standard, rate-limited API calls
- **Security**
  - Supabase RLS ensures users only access their own data
  - No secrets exposed to the client (OpenAI key used only server-side)
- **Performance**
  - Mostly server components (except interactive forms)
  - Tailwind-only styling (no heavy component framework)
  - Minimal client-side JS on the landing page

---

## Next Steps & Possible Extensions

- Add:
  - History pages: list past resumes, job descriptions, and cover letters
  - Section-level regeneration (per paragraph)
  - PDF export for cover letters
  - Billing and plans (Stripe)
  - Teams / shared templates
- Harden:
  - Better error surfaces and observability
  - More sophisticated DOCX parsing
  - Rate limiting per user / per plan

This project is ready to deploy as an MVP and to showcase in a professional portfolio as a production-style SaaS application.

