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

### wrapper generation

Wrappers of the contentful contentmodel are generated via 
https://github.com/intercom/contentful-typescript-codegen

Any chance to the content model will require the command

```
npm run generate:types 
```

to run.

### Components
The entire site uses Tailwind CSS and an occasional Flowbite React component (nav).

### storybook
Storybook stories exist for most components.

https://github.com/renatomoor/storybook-tailwind-dark-mode


