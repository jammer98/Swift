# Swift

Swift is a full-stack job marketplace that connects candidates with employers.
Candidates can discover roles, submit applications with resumes, and track their
application status. Employers can create a company profile, publish jobs, and
review and update applicant statuses.

## Live application

The frontend is deployed on Vercel:

**[https://swift-alpha-sand.vercel.app/](https://swift-alpha-sand.vercel.app/)**

The frontend is a Next.js application and requires a running backend API. The
deployed frontend uses the backend URL configured through the
`NEXT_PUBLIC_API_URL` environment variable.

## Core features

- Public job search with keyword, location, and employment-type filters
- Job details and company information
- Candidate and employer registration with role-based experiences
- Candidate resume upload and cover-letter submission
- Candidate application history and status tracking
- Employer company profile management
- Employer job creation, editing, and deletion
- Employer applicant review and application-status updates
- Responsive interface built with Tailwind CSS

## Architecture

This repository contains the **frontend** of Swift:

- **Next.js App Router** provides pages, layouts, and client-side flows.
- **React** manages interactive forms, authentication state, search, and
  dashboards.
- **Tailwind CSS** provides the visual design system.
- [`lib/api.ts`](./lib/api.ts) is the single frontend API client. It sends JSON
  requests for normal operations and `FormData` for resume uploads.
- [`components/auth.tsx`](./components/auth.tsx) stores the authenticated user
  and API token in browser local storage.
- [`components/protected.tsx`](./components/protected.tsx) protects pages and
  redirects users based on authentication and role.

The backend is a separate REST API. It owns the database, validation,
authorization, file handling, and business rules. The frontend communicates
with it through endpoints such as:

```text
POST  /api/auth/register
POST  /api/auth/login
GET   /api/jobs
GET   /api/jobs/:id
POST  /api/jobs
POST  /api/jobs/:id/apply
GET   /api/applications/mine
GET   /api/jobs/:id/applications
PATCH /api/applications/:id/status
```

## Full-stack workflow

### 1. Configure the API

Create a local environment file:

```bash
cp .env.example .env.local
```

Set the API origin in `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

For production, set `NEXT_PUBLIC_API_URL` in the Vercel project settings to
the deployed backend URL, then redeploy the frontend. Because this variable is
exposed to the browser, it should contain only the public API origin and never
private credentials.

### 2. Start the backend

Start the REST API and its database according to the backend project’s
instructions. Confirm that the API is reachable from the browser and that it
allows requests from:

```text
http://localhost:3001
https://swift-alpha-sand.vercel.app
```

The backend must also support the `Authorization: Bearer <token>` header and
multipart form uploads for resume applications.

### 3. Run the frontend

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

The frontend runs at [http://localhost:3001](http://localhost:3001).

### 4. Use the application by role

**Candidate flow**

1. Register with the `candidate` role or sign in.
2. Browse and filter open jobs.
3. Open a job, upload a resume, and optionally add a cover letter.
4. View submitted applications from **My applications**.
5. Track status changes made by employers.

**Employer flow**

1. Register with the `employer` role or sign in.
2. Create or update the company profile.
3. Create and publish a job.
4. Edit or close jobs from **My jobs**.
5. Review applicants and update application statuses.

### 5. Request and authentication flow

After registration or login, the backend returns a user object and token. The
frontend stores both in local storage and attaches the token to protected API
requests. If the API returns `401 Unauthorized`, the frontend clears the
saved session and redirects the user to the login page.

Role checks are enforced in the UI for navigation and protected pages. The
backend must independently enforce authentication, ownership, and role
authorization for every protected endpoint.

## Vercel deployment

To deploy a new frontend version:

1. Import this repository into Vercel.
2. Select the default Next.js build settings.
3. Add `NEXT_PUBLIC_API_URL` under the project’s Environment Variables.
4. Configure the variable for the required environments: Preview and
   Production.
5. Add the Vercel frontend origin to the backend CORS allowlist.
6. Deploy and verify registration, login, job browsing, and resume upload.

The expected production URL is:

```text
https://swift-alpha-sand.vercel.app
```

If the API URL changes, update the Vercel environment variable and trigger a
new deployment. Environment variables are injected at build time for this
frontend.

## Project structure

```text
app/
  page.tsx                     Home page
  jobs/                        Public job listing and details
  employer/                    Employer dashboard and company flows
  my-applications/             Candidate application history
  login/                       Login page
  register/                    Registration page
components/
  navbar.tsx                   Navigation and role-aware links
  auth.tsx                     Authentication context
  protected.tsx                Client-side access guard
  job-form.tsx                 Create and edit job form
  jobs-client.tsx              Job search and filtering UI
lib/
  api.ts                       Typed REST API client
  types.ts                     Shared frontend domain types
  format.tsx                   Job cards and formatting helpers
```

## Available scripts

```bash
npm run dev       # Start the development server on port 3001
npm run build     # Create a production build and run type validation
npm run start     # Start the production build on port 3001
```

## Troubleshooting

- **Requests go to the wrong server:** check `NEXT_PUBLIC_API_URL` in
  `.env.local` or Vercel project settings.
- **CORS errors:** add both the local and production frontend origins to the
  backend CORS configuration.
- **Login immediately expires:** verify that the API returns a valid token and
  accepts the `Authorization: Bearer <token>` header.
- **Resume upload fails:** verify that the backend accepts `multipart/form-data`
  at `POST /api/jobs/:id/apply` and that file-size/type limits are configured.
- **Production changes are not visible:** update the Vercel environment
  variable and redeploy, since public environment variables are build-time
  configuration.

## License

Add the project license here if this repository is distributed publicly.
