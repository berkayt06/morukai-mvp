# MorukAI

> WhatsApp'taki kişisel yaşam koçun. Sıcak, dürüst, motive edici bir AI moruk.

MorukAI is a WhatsApp-based AI life coach. Users subscribe through a clean
landing page, complete a short onboarding (goal, tone, daily message time),
and start chatting with a warm, best-friend-style AI on WhatsApp. A daily
scheduled message keeps them moving.

This repo is a working **MVP** built with:

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS for the UI (lively colors + 3D-feel gradients/blobs)
- Prisma + PostgreSQL (Supabase compatible)
- Anthropic Claude (Sonnet 4.6) for the AI personality
- WhatsApp Cloud API (Meta) for messaging
- PayTR (iframe API) for Turkish payments
- Vercel Cron for daily messages

---

## Project structure

```
app/
  page.tsx                        Landing page
  onboarding/                     Sign-up / onboarding flow
  checkout/                       Plan selection + PayTR iframe
  success/                        Post-payment confirmation
  admin/                          Password-gated admin dashboard
    page.tsx                      Stats overview
    users/                        User list + detail (history, actions)
    login/                        Admin login
  api/
    users/                        Create/upsert user (onboarding submit)
    whatsapp/webhook/             Meta webhook (verify GET + inbound POST)
    whatsapp/send/                Manual send (admin)
    ai/respond/                   Generate a Morukai-style reply
    cron/daily-message/           Daily scheduled message endpoint
    paytr/create/                 Create PayTR iframe token
    paytr/webhook/                PayTR callback (activates subscription)
    admin/login, admin/logout     Auth
    admin/users/[id]              PATCH / DELETE user
lib/
  ai.ts          System prompt + reply / daily-message generators
  whatsapp.ts    Cloud API send + webhook payload parser
  paytr.ts       PayTR iframe token + callback hash verifier
  plans.ts       Editable pricing
  prisma.ts      Prisma client singleton
  admin.ts       Cookie-based admin auth helper
prisma/
  schema.prisma  users / messages / subscriptions / scheduled_messages
```

---

## 1. Setup

```bash
npm install
cp .env.example .env
# fill in secrets — at minimum DATABASE_URL and ADMIN_PASSWORD
npm run db:push        # creates tables
npm run dev
```

The app runs at <http://localhost:3000>.

### Required environment variables

See `.env.example`. Quick cheat sheet:

| Var | What |
| --- | --- |
| `DATABASE_URL` | Postgres connection string (Supabase pooled URL works) |
| `ANTHROPIC_API_KEY` | Claude key for AI replies |
| `WHATSAPP_ACCESS_TOKEN` | Permanent system-user token from Meta |
| `WHATSAPP_PHONE_NUMBER_ID` | The phone number ID for your WABA number |
| `WHATSAPP_VERIFY_TOKEN` | Any string — must match what you set in Meta webhook config |
| `PAYTR_MERCHANT_ID/KEY/SALT` | From your PayTR merchant panel |
| `PAYTR_TEST_MODE` | `1` for sandbox, `0` for live |
| `ADMIN_PASSWORD` | Password for `/admin/login` |
| `CRON_SECRET` | Secret for protecting the cron endpoint |
| `NEXT_PUBLIC_SITE_URL` | Public base URL — used for PayTR ok/fail URLs |

If `ANTHROPIC_API_KEY` is missing, the app still runs and falls back to a
canned reply so you can test the rest of the flow.

If PayTR creds are missing **in development**, `/api/paytr/create` will
fall back to "auto-success" so you can keep iterating on the funnel.

---

## 2. Database (Supabase or any Postgres)

1. Create a project on [supabase.com](https://supabase.com) (or run Postgres
   locally / on Railway).
2. Copy the **pooled** connection string into `DATABASE_URL`.
3. Run `npm run db:push`.

The schema (`prisma/schema.prisma`) creates four tables:

- `User` — profile + tone + daily message time + subscription status
- `Message` — every WhatsApp inbound/outbound message
- `Subscription` — payment provider state
- `ScheduledMessage` — log of daily messages we sent

---

## 3. WhatsApp Cloud API setup

1. Go to <https://developers.facebook.com/> → Apps → Create App → Business.
2. Add the **WhatsApp** product. Get a test phone number (free) or connect
   a real WABA number.
3. Copy:
   - `Phone number ID` → `WHATSAPP_PHONE_NUMBER_ID`
   - Temporary token (for testing) or generate a permanent System User
     token → `WHATSAPP_ACCESS_TOKEN`
4. Set a **Verify Token** of your choosing → `WHATSAPP_VERIFY_TOKEN`.
5. Configure the webhook:
   - Callback URL: `https://YOUR_DOMAIN/api/whatsapp/webhook`
   - Verify Token: same as the env var.
   - Subscribe to the `messages` field.
6. From the WhatsApp test panel, send a `hello world` template to your own
   number (Meta requires the user to message you first within a 24h window
   for free-form replies).

### Test the webhook locally

Use [ngrok](https://ngrok.com) or `cloudflared tunnel`:

```bash
ngrok http 3000
# Point Meta's webhook callback URL at:
#   https://<ngrok>.ngrok-free.app/api/whatsapp/webhook
```

Send a WhatsApp message to your test number → MorukAI replies.

---

## 4. PayTR setup

1. Sign up at <https://www.paytr.com> and complete merchant onboarding.
2. From the merchant panel get `Merchant ID`, `Merchant Key`, `Merchant Salt`.
3. Add the webhook URL (Bildirim URL) in PayTR settings:
   `https://YOUR_DOMAIN/api/paytr/webhook`.
4. Set `PAYTR_TEST_MODE=1` until you go live.

PayTR's iframe is loaded inside `/checkout` after `/api/paytr/create`
returns a token. On callback, `/api/paytr/webhook` validates the HMAC
and flips the user's `subscriptionStatus` to `active`.

---

## 5. AI personality

The system prompt lives in `lib/ai.ts → buildSystemPrompt()`. It bakes in:

- Turkish or English depending on user's `language` field
- Warm, close, motivating, never-clinical tone
- Hard guardrails: not a doctor / therapist / psychologist; refer to
  emergency services on crisis; recommend professionals for medical /
  legal / financial advice
- Short, WhatsApp-style replies (2–4 sentences), one tiny action per turn

History (last 20 messages) is sent with each reply so the AI keeps context.

Default model: `claude-sonnet-4-6`. Edit the `MODEL` constant in `lib/ai.ts`.

---

## 6. Daily messages

`/api/cron/daily-message` walks all active users and sends a morning
message if their local time matches `dailyMessageTime` (HH:mm in their
timezone).

- **Production**: Vercel Cron is configured in `vercel.json` to hit the
  endpoint every 15 minutes. Vercel automatically attaches
  `Authorization: Bearer $CRON_SECRET`.
- **Manual trigger** (admin):

  ```bash
  curl 'https://YOUR_DOMAIN/api/cron/daily-message?force=1&userId=USER_ID' \
    -H "Authorization: Bearer $CRON_SECRET"
  ```

Or open `/admin/users/[id]` and click **"Günlük mesajı şimdi gönder"**.

---

## 7. Admin dashboard

- Go to `/admin/login`, enter `ADMIN_PASSWORD`.
- `/admin` — stats overview
- `/admin/users` — full list
- `/admin/users/[id]` — edit goal/tone/time, activate/deactivate, view
  full WhatsApp conversation, manually send a message, trigger the
  daily message immediately.

---

## 8. Deploy on Vercel

1. Push this repo to GitHub.
2. Import to Vercel.
3. Add all env vars (Production + Preview).
4. Vercel automatically picks up `vercel.json` for the cron.
5. After first deploy, run `npx prisma db push` once against your
   production DB (or do it locally with the prod DATABASE_URL).
6. Update WhatsApp + PayTR webhook URLs to the Vercel domain.

The build runs `prisma generate && next build` automatically.

---

## 9. Pricing

Edit `lib/plans.ts`:

```ts
{ id: "monthly", priceTry: 199, intervalDays: 30, ... }
```

The landing page, `/checkout`, and PayTR token creation all read from
this single source of truth.

---

## 10. Important product rules

- MorukAI is **not** a doctor, therapist, psychologist, or medical
  professional. The system prompt enforces this and refers users to
  professionals for crises.
- Tone: warm, close, honest, motivating, like a best friend. Never
  corporate / robotic / preachy.
- Always one small action per reply. Short messages.

Hadi moruk, başlayalım.
