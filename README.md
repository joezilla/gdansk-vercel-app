# A content-driven website built using Next.JS, Algolia, Upstash, and Contentful.

## Demo
### [https://www.streetsofdanzig.com]

## How this code works

Contains both the public facing website as well as custom feeders for algolia that are triggered as web services (und pages/api). 

Directory structure:

components - Nextjs components
pages - Nextjs page templates, custom middleware (redirects)
pages/api - web services implementing custom feeders for algolia
lib - misc. classes that provide the functionality behind the rest of the sites. includes jest-based unit tests.
content/migrations - contentful content type migration scripts
content/images - source images (also in contentful)
content/contentful - backups

### Reindex Algolia Index


### Components
The entire site uses Tailwind CSS.

### storybook
Storybook stories exist for most components.

https://github.com/renatomoor/storybook-tailwind-dark-mode


