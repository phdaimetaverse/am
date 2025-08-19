# Collaboration Plan: Learning Metaverse

## Overview
A lightweight A‑Frame learning metaverse with zones, quizzes, portals, and HUD. Goal: extend to multiuser, content-driven scenes, and production hosting.

## Roles
- Agent-A (Builder): scene architecture, data model, performance, security, deployment
- Agent-B (UX/Multiplayer): UI polish, accessibility, avatar system, multiplayer, content authoring tooling

## Conventions
- TODO tags in code/comments: `TODO[Owner][Priority]: description`
  - Owner: Agent-A or Agent-B
  - Priority: P0 (urgent), P1 (high), P2 (normal), P3 (later)
- Status tags in this file only: [TODO] [IN_PROGRESS] [BLOCKED] [DONE]
- Branching: small PRs per task; name as `feat/<task>` or `chore/<task>`

## Task Board
- [TODO][P0][Agent-B] Expose container port for preview in IDE (Ports/Preview). Verify 8000/8080/3000.
- [TODO][P1][Agent-A] Externalize quizzes to `content/quizzes.json` and render dynamically.
- [TODO][P1][Agent-B] Persist score to `localStorage` and restore on load.
- [TODO][P1][Agent-B] Avatar selector UI in HUD; basic avatar mesh in scene.
- [TODO][P1][Agent-B] Integrate `networked-aframe` for multiplayer presence (avatars + nameplates).
- [TODO][P1][Agent-A] Content pipeline: support `content/scenes.json` for zones and text.
- [TODO][P2][Agent-B] Accessibility: keyboard focus outlines, ARIA for HUD controls, high-contrast theme.
- [TODO][P2][Agent-A] Performance: lazy-load assets, pool entities, reduce overdraw.
- [TODO][P2][Agent-A] Security: add CSP meta, pin CDN versions, SRI for scripts.
- [TODO][P2][Agent-B] UI polish: HUD layout responsiveness, active zone mini-map.
- [TODO][P3][Agent-A] Deployment: static hosting config (e.g., Vercel/Netlify), cache headers.
- [TODO][P3][Agent-B] Classroom enhancements: lecture slides loader, seat interactions.

## Handoffs
- Next Up (Agent-B):
  1) Port/preview fix; confirm accessible URL and add to this doc
  2) Add `localStorage` score persistence (see TODO in `app.js`)
  3) Sketch avatar selector in HUD (see TODO in `index.html`)

- Next Up (Agent-A):
  1) Create `content/quizzes.json` and dynamic render
  2) Add basic content loader to `app.js`

## Definition of Done
- Scene loads with no console errors
- Quizzes driven by JSON content
- Score persists across refresh
- Multiplayer: see at least two avatars in the hub
- Deployed preview URL available

## Notes
- Current servers listening: 8000, 8080, 3000 (inside container). Use IDE Ports/Preview to open.