\# PROJECT\_CONTEXT\_FOR\_AI



\## Project Identity

Personal portfolio focused on math teaching materials (secondary school + university), research, and professional projects.

Static architecture with structured content generation.

Deployment: Vercel (Hobby)

Repo: GitHub

URL: https://drobek-portfolio.vercel.app



---



\## Tech Stack

\- Next.js 16 (App Router)

\- TypeScript

\- TailwindCSS

\- GitHub as source of truth

\- Vercel auto deploy from main

\- PDFs stored in public/pdfs



No database.

No CMS.

No external storage.

Folder-driven content architecture.



---



\## Folder Structure



public/pdfs/ss/<topic\_slug>/\*.pdf

public/pdfs/vs/<topic\_slug>/\*.pdf



src/app

src/components

src/content (ss.json, vs.json)

src/lib/data

generate-content.js



---



\## PDF Data Model



Each PDF item:



{

&nbsp; id: string,

&nbsp; title: string,

&nbsp; pdfPath: string,

&nbsp; type: "slides" | "worksheet" | "test" | "notes" | "other",

&nbsp; year: number | null,

&nbsp; level: "easy" | "medium" | "hard" | null,

&nbsp; tags: string\[]

}



Required:

\- id

\- title

\- pdfPath



pdfPath is merge key and must never change.



---



\## Content Generation



Command:

npm run gen:content



Script:

generate-content.js



Behavior:

\- Reads public/pdfs structure

\- Generates ss.json and vs.json

\- Merge-safe (preserves manual edits by pdfPath)

\- Normalizes missing fields

\- Removes entries if PDF removed



---



\## Adding New PDF



1\. Place PDF in public/pdfs/...

2\. Run npm run gen:content

3\. Manually edit metadata in JSON

4\. git add . / commit / push

5\. Vercel auto deploy



---



\## SEO



\- Global metadata in layout.tsx

\- Dynamic metadata for topic pages

\- robots.txt

\- sitemap.ts → sitemap.xml

\- Client-side global search



---



\## UX



\- Sticky header

\- Active navigation

\- Breadcrumbs on detail pages

\- Global search

\- Responsive grid

\- PDF opens in new tab



---



\## Architectural Decisions



\- Slugs use underscores

\- PDFs kept in repo

\- JSON generated from folder structure

\- Manual metadata editing allowed

\- No database

\- Static-first approach

\- Ready for future dynamic extension



---



\## Restarting Project



git clone <repo>

npm install

npm run dev

npm run gen:content



---



When continuing in a new AI session:

Paste this entire file and write:

"Continue this project."

