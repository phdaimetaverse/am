## Agent Coordination Brief

Roles
- Agent A (Writer): drafts posts in `marketing/posts/`, aligns to `brand-voice.md`, adds links + alt text
- Agent B (Producer): captures assets in `marketing/assets/`, filenames match the calendar entries
- This Agent (Coordinator): maintains calendar, runs validation, merges PRs, and schedules posts

How to work
1) Pick an item from `marketing/content-calendar.csv` with status `idea` or `draft`
2) Writer creates/updates the `copy_path` file; Producer updates `asset_path`
3) Move status to `ready` when both are in place
4) Coordinator reviews and moves to `scheduled` and updates `automation/schedule.sample.yaml` (or a dated schedule file)
5) After posting, set `posted` and paste the link in `notes`

SLAs
- Drafts: within 2 days of selection
- Review: within 24 hours

Quality checklist
- Clear outcome, one idea per post, concrete nouns, short sentences
- Proper alt text
- Links include UTM parameters

