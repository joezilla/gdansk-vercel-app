# Streets of Danzig - Next.js Website

A modern, content-driven website built with Next.js, featuring internationalization, search capabilities, and a robust content management system.

## 🌐 Live Demo
[https://www.streetsofdanzig.com]

## 🚀 Tech Stack

- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **Search**: Algolia
- **Caching**: Upstash Redis
- **CMS**: Contentful
- **Testing**: Jest
- **Component Development**: Storybook
- **Internationalization**: i18next
- **Maps**: Google Maps React
- **UI Components**: Flowbite React
- **Analytics**: Google Tag Manager

## 📁 Project Structure

```
├── app/                    # Next.js 14 app directory
│   ├── [lang]/            # Internationalized routes
│   ├── api/               # API routes
│   └── styles/            # Global styles
├── components/            # React components
├── lib/                   # Utility functions and shared logic
├── content/              # Content management
│   ├── migrations/       # Contentful content type migrations
│   ├── images/          # Source images
│   └── contentful/      # Contentful backups
├── public/               # Static assets
├── scripts/             # Build and utility scripts
├── styles/              # Global styles
└── types/               # TypeScript type definitions
```

## 🛠️ Development

### Prerequisites

- Node.js (Latest LTS version recommended)
- pnpm (Package manager)

### Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
```

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm test` - Run tests
- `pnpm test:watch` - Run tests in watch mode
- `pnpm test:coverage` - Run tests with coverage
- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Fix ESLint issues
- `pnpm typecheck` - Run TypeScript type checking
- `pnpm storybook` - Start Storybook
- `pnpm setup` - Set up Contentful environment

## 🔍 Search Integration

The site uses Algolia for search functionality. Custom feeders are implemented as web services in the `pages/api` directory.

## 🌍 Internationalization

The site supports multiple languages using Next.js internationalization features and i18next. Language-specific routes are handled in the `app/[lang]` directory.

## 🎨 Component Development

The project uses Storybook for component development and documentation. Stories are available for most components, supporting both light and dark modes.

## 📝 Content Management

Content is managed through Contentful CMS. The project includes:
- Content type migrations
- Backup functionality
- Rich text rendering
- Image optimization

## 🧪 Testing

Jest is used for unit testing with the following features:
- Jest DOM for DOM testing
- React Testing Library for component testing
- User Event for interaction testing
- Coverage reporting

## 🔧 Configuration

- `next.config.js` - Next.js configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `jest.config.js` - Jest configuration
- `i18n-config.ts` - Internationalization settings
- `tsconfig.json` - TypeScript configuration

## 📚 Documentation

Additional documentation can be found in the `docs/` directory.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is private and proprietary.
