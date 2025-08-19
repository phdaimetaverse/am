# Plan: Learning Metaverse

Use this checklist to coordinate implementation. Edit in place and check items as they’re completed.

## Setup & Infrastructure
- [ ] Ensure `pnpm i` bootstraps successfully in workspace
- [ ] Define required `.env` for each app/package (see `apps/web/env.d.ts`)
- [ ] Verify dev flow: `pnpm dev` runs web and any local servers

## Authentication
- [ ] Configure `next-auth` provider(s) and session strategy
- [ ] Protect dashboard/classroom routes behind auth
- [ ] Add sign-in/out flows and session checks

## Realtime / Server
- [ ] Confirm RT server URL (`NEXT_PUBLIC_RT_URL`) and local dev endpoint
- [ ] Define minimal signaling/protocol schema in `packages/rt`
- [ ] Implement presence + simple broadcast (chat/position)

## Classroom MVP
- [ ] Render classroom scene (avatars + basic environment) in `apps/web/app/classroom`
- [ ] Hook `ChatPanel` and `InstructorToolbar`
- [ ] Join/leave session logic, role-based UI (student/instructor)

## Quality & Delivery
- [ ] Add lint/typecheck to CI (Turborepo pipeline)
- [ ] Basic e2e flow: login -> dashboard -> join classroom -> exchange one message
- [ ] Deploy web + server to staging

## Notes
- Branch naming: `feature/<task>`, `fix/<issue>`
- Open PRs early; use this file to track status

