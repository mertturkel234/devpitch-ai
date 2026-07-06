# Contributing to DevPitch AI

## Branch Strategy

| Branch | Purpose |
|--------|---------|
| `main` | Production-ready |
| `feat/*` | New features |
| `fix/*` | Bug fixes |
| `docs/*` | Documentation |

## Commit Convention

```
feat: add Kanban drag-and-drop persistence
fix: resolve Stripe webhook signature validation
docs: add architecture mermaid diagram
refactor: extract OpenAI prompt builder
```

## PR Checklist

- [ ] `npm run build` passes
- [ ] No `.env.local` or secrets committed
- [ ] Prisma schema changes include migration notes
- [ ] README updated for new env vars or setup steps

## Security

Report vulnerabilities via [SECURITY.md](./SECURITY.md).
