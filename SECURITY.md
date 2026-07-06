# Security Policy

## Reporting

Email **turkelmert96@gmail.com** — do not open public issues for security vulnerabilities.

## Practices

- All secrets in `.env.local` (see `.env.example`)
- Stripe webhook signature verification enforced
- NextAuth secure session management
- OpenAI API calls server-side only
- User-uploaded PDFs processed in memory, not stored permanently without consent
