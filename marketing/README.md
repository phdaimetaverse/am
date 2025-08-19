## Metaverse Learning — Marketing Ops

This folder centralizes social media and launch marketing for the project.

### Goals
- Build awareness for Metaverse Learning
- Share transparent dev updates and demos
- Drive sign-ups/feedback during alpha

### Primary Channels
- X (Twitter): fast updates, threads, short demo clips
- LinkedIn: product updates, partnerships, hiring
- Reddit (optional): deeper technical posts in relevant subs
- Discord (optional): community announcements

### Cadence (baseline)
- 2–3 X posts/week (1 thread every 1–2 weeks)
- 1 LinkedIn post/week
- 1 monthly recap post

### Source of truth
- Content calendar: `marketing/content-calendar.csv`
- Post drafts: `marketing/posts/`
- Templates: `marketing/platforms/`
- Assets: `marketing/assets/`
- Team process: `marketing/process/roles-and-rituals.md`
 - Brand voice: `marketing/brand-voice.md`

### Workflow
1) Ideate: add ideas to the calendar with status "idea"
2) Draft: write copy in `marketing/posts/` and link it in the calendar
3) Asset: attach image/video path in the calendar
4) Review: quick async review in PR or by tagging owners in the calendar
5) Schedule: create an entry in `marketing/automation/schedule.sample.yaml` (copy to a dated file)
6) Post: manual now; automation is optional and must use environment-based credentials

### Brand quick-start
- Voice: curious, clear, practical, inclusive (see `brand-voice.md`)
- Style: show, don’t tell; concrete benefits; short sentences on X
- Visuals: short clips or high-contrast screenshots; annotate sparingly

### UTM
Use `?utm_source=<platform>&utm_medium=social&utm_campaign=<campaign>` on links.

