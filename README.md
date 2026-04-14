# Stanly Wedding Invitation (Next.js + Convex)

This small wedding invitation site uses Next.js and Convex (server functions + DB). It stores RSVPs in Convex and is ready for deployment to Vercel's free tier.

Quick overview

- Invitation page with RSVP form (client) — posts to `/api/rsvp`.
- Admin page `/admin` protected by a simple `ADMIN_PASSWORD` env var that fetches RSVP data via `/api/admin/rsvps`.
- Convex functions handle DB operations (`addRsvp`, `getRsvps`).

Cost

- Hosting → FREE (Vercel)
- Database/Server functions → Convex free tier (suitable for wedding sites)

Contents

- `components/Invitation.jsx` — landing page + RSVP form.
- `pages/api/rsvp.js` — server route that calls Convex `addRsvp` mutation.
- `pages/api/admin/rsvps.js` — server route that calls Convex `getRsvps` query (protected by `ADMIN_PASSWORD`).
- `convex/functions/` — example Convex functions to deploy.

Local setup

1. Clone the repo and install:

```bash
cd /Users/rinsafathima/Desktop/stanly-wedding-invitation
npm install
```

2. Create a Convex project at https://convex.dev and generate a Server Key (token). Note the Project URL (example: `https://your-project.convex.cloud`).

3. Create a `.env.local` in the repo root with:

```env
CONVEX_SERVER_KEY="your-convex-server-key"
CONVEX_PROJECT_URL="https://your-project.convex.cloud"
ADMIN_PASSWORD=choose-a-strong-password
```

4. Start the dev server:

```bash
npm run dev
```

Deploy Convex functions
The repository includes `convex/functions/addRsvp.js` and `convex/functions/getRsvps.js` as examples — deploy them to your Convex project.

Recommended (CLI):

```bash
# login (first time only)
npx convex login
# deploy functions from convex/functions/
npx convex deploy
```

Or use the helper script in this repo:

```bash
# Ensure CONVEX_PROJECT_URL and CONVEX_SERVER_KEY are set
npm run deploy-convex
```

Vercel deployment

1. Push the repository to GitHub (or another Git provider):

```bash
git add .
git commit -m "Convex migration and Vercel-ready"
git push origin main
```

2. Import the repo into Vercel: https://vercel.com/new → select your repo.

3. Add environment variables in Vercel (Project → Settings → Environment Variables):
   - `CONVEX_SERVER_KEY` = (server key from Convex)
   - `CONVEX_PROJECT_URL` = `https://your-project.convex.cloud`
   - `ADMIN_PASSWORD` = (your admin password)

4. Deploy. Vercel will run `npm run build` automatically.

Verification

- Visit the site: `https://<your-vercel-project>.vercel.app` and submit an RSVP.
- View admin: `https://<your-vercel-project>.vercel.app/admin` — enter `ADMIN_PASSWORD` and click Load RSVPs.

Troubleshooting

- If API routes return `CONVEX_SERVER_KEY and CONVEX_PROJECT_URL must be set` — ensure Vercel env vars are set and redeploy.
- If Convex functions fail at runtime — check Convex dashboard logs for errors.
- If admin returns 401 — confirm `ADMIN_PASSWORD` matches and is sent as header `x-admin-password`.

Optional improvements

- Add a CSV export for RSVPs (`/api/admin/export`).
- Add a session-based admin login cookie to avoid sending password every request.
- Add printable Save-the-Date (PDF) or calendar `.ics` download.

Enjoy the wedding site! 🎉
