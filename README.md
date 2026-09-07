# CourtSide

A basketball team management app for coaches, players and parents, built with
Next.js, Prisma/PostgreSQL, Auth.js (email + password) and Resend (email).

- **Coach** — creates group ages (teams), approves players into a roster, and
  schedules trainings and games.
- **Player** — joins a group age, sees their upcoming trainings/games, and
  gets a personal invite code to share with a parent.
- **Parent** — links to their child using that invite code and follows their
  child's schedule.

Trainings notify the whole approved roster of a group; games notify only the
specific players the coach selects, plus any parents linked to them.

## Prerequisites

- Node.js 20+
- Docker (for a local Postgres database) — or any Postgres connection string
- A [Resend](https://resend.com) account (optional in dev — see below)

## 1. Install dependencies

```bash
npm install
```

## 2. Configure environment variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

| Variable | Where to get it |
| --- | --- |
| `DATABASE_URL` | Defaults to the local `docker-compose.yml` Postgres. |
| `AUTH_SECRET` | Any random string, e.g. `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`. |
| `RESEND_API_KEY` / `EMAIL_FROM` | [resend.com](https://resend.com) → API Keys. Leave `RESEND_API_KEY` empty in dev and emails are logged to the server console instead of being sent. |
| `COACH_EMAILS` | Comma-separated email addresses allowed to register as the coach. |

## 3. Start Postgres and run migrations

```bash
docker compose up -d
npx prisma migrate dev --name init
```

## 4. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and sign up. Use an email
listed in `COACH_EMAILS` to register as the coach; use other emails to try
the player/parent flows.

## Notes

- Notifications are logged to the console when `RESEND_API_KEY` is unset, so
  the full training/game notification flow can be tested without a real
  email provider.
- `npx prisma studio` opens a GUI to browse/edit the database directly.
