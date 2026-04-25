# Stratycs

> Mobile-first quoting tool for HVAC contractors — instant PDF estimates via SMS/email.

**Live:** [stratycs.com](https://stratycs.com)

---

## What It Does

Stratycs lets HVAC contractors build and send professional job estimates in minutes, directly from their phone. No desktop required, no complicated software — just fill in the job details, generate a branded PDF, and send it to the customer via SMS or email on the spot.

**$29/month. No contracts.**

---

## Features

- **Mobile-first UI** — designed for contractors in the field, not at a desk
- **Instant PDF estimates** — auto-generated, branded quotes ready to send
- **SMS & email delivery** — send directly to customers without leaving the app
- **Fast quote builder** — line items, labor, materials, tax, and totals
- **Professional output** — clean, contractor-branded estimate PDFs

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js, Tailwind CSS |
| Deployment | Vercel |
| Payments | Stripe |
| PDF Generation | Server-side rendering |
| Domain | Namecheap → stratycs.com |

---

## Getting Started

```bash
# Clone the repo
git clone https://github.com/yourusername/stratycs.git
cd stratycs

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Fill in: STRIPE_SECRET_KEY, NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY, etc.

# Run locally
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

---

## Environment Variables

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

---

## Roadmap

- [ ] Customer portal / estimate history
- [ ] E-signature on estimates
- [ ] Multi-trade support (plumbing, electrical)
- [ ] QuickBooks integration
- [ ] Team/crew accounts

---

## License

Private. All rights reserved — Stratycs LLC.
