# Resume Accent Color Design

## Goal

Change the public general resume's blue accent to `#15b373` while preserving its current layout, typography, spacing, and neutral colors.

## Scope

- Change only the `--accent` variable in `docs/resume-general.html` from `#1d4ed8` to `#15b373`.
- Regenerate `public/resume.pdf` and `output/pdf/yongjae-kwon-web-developer-resume.pdf` from the updated HTML.
- Keep company-specific resumes private and local. Do not add or modify files under `docs/applications` or cached application outputs.

## Verification

- Confirm both generated PDFs are identical, valid two-page A4 documents.
- Render both pages and visually confirm that former blue section headings use `#15b373` with no layout changes, clipping, or overlap.
- Run the existing project test and production build to ensure the public resume asset remains deployable.
