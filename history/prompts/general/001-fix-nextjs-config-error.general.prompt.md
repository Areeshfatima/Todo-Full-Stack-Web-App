---
id: 1
title: "Fix NextJS Config Error"
stage: "red"
surface: "agent"
date_iso: "2026-02-05"
model: "claude-sonnet-4-5-20250929"
feature: "none"
branch: "main"
user: "unknown"
command: "manual"
labels: ["nextjs", "configuration", "bug-fix"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files_yaml:
  - "/frontend/next.config.js"
tests_yaml:
  - "none"
---

# Fix NextJS Config Error

## Prompt Text
```
error occur solve it:
> todo-mastery-frontend@1.0.0 dev
> next dev

⚠ Invalid next.config.js options detected:
⚠     Unrecognized key(s) in object: 'serverComponentsExternalPackages' at "experimental"
⚠ See more info here: https://nextjs.org/docs/messages/invalid-next-config
⚠ `experimental.serverComponentsExternalPackages` has been moved to `serverExternalPackages`. Please update your next.config.js file accordingly.
▲ Next.js 16.1.6 (Turbopack)
- Local:         http://localhost:3000
- Network:       http://172.25.33.135:3000
- Environments: .env
- Experiments (use with caution):
  ? serverComponentsExternalPackages (invalid experimental key)

✓ Starting...
```

## Response Text
Fixed the deprecated Next.js configuration by updating next.config.js to use the new `serverExternalPackages` property instead of the deprecated `experimental.serverComponentsExternalPackages`.

## Outcome Impact
Resolved the Next.js configuration warning about the deprecated experimental property, allowing the development server to start without warnings.

## Files Summary
- Updated `/frontend/next.config.js` to use the correct property name

## Tests Summary
- Verified the configuration file loads without errors

## Next Prompts
- Test the Next.js development server to ensure it starts without warnings

## Reflection Note
The Next.js API changed the location of the `serverComponentsExternalPackages` property from the experimental section to a top-level property called `serverExternalPackages`.

## Failure Modes Observed
None

## Next Experiment to Improve Prompt Quality
N/A