# A content-driven website built using Next.JS, Algolia, Upstash, and Contentful.

## Demo
### [https://www.streetsofdanzig.com]

## How this code works

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


