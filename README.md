# Job Board frontend

Next.js App Router frontend for the Job Board REST API. The backend should run on
`http://localhost:3000`; this frontend runs on `http://localhost:3001`.

## Local development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Set `NEXT_PUBLIC_API_URL` in `.env.local` if the API is hosted elsewhere. The
frontend intentionally keeps API calls in `lib/api.ts` and API response/request
types in `lib/types.ts`.

## Vercel deployment

Import this project into Vercel, then add the environment variable
`NEXT_PUBLIC_API_URL` with the deployed backend URL (for example
`https://api.example.com`). Deploy using the default Next.js settings.
# Swift
