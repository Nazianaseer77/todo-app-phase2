# Next.js Development Skill

## Overview
Next.js is a React-based framework that enables functionality such as server-side rendering and generating static websites. This skill provides guidance for developing applications using Next.js.

## Key Concepts
- **Pages**: Next.js uses a file-based routing system where each file in the `pages` directory becomes a route.
- **Components**: Reusable UI elements that can be shared across pages.
- **API Routes**: Server-side functions that can be called from the frontend.
- **Static Generation**: Pre-rendering pages at build time.
- **Server-Side Rendering**: Pre-rendering pages on each request.

## File Structure
```
my-nextjs-app/
├── pages/
│   ├── index.js          # Home page (route: /)
│   ├── about.js          # About page (route: /about)
│   └── api/
│       └── hello.js      # API endpoint (route: /api/hello)
├── public/
│   └── favicon.ico
└── components/
    └── Header.js
```

## Common Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server

## Best Practices
1. Use dynamic imports for code splitting
2. Implement proper error handling
3. Optimize images with the Image component
4. Use CSS Modules for scoped styling
5. Implement proper SEO with Head component
6. Handle API routes securely

## Common Patterns
- Layout components for shared UI
- Custom App and Document components
- Environment variables for configuration
- Static generation vs server-side rendering considerations
- Client-side data fetching with SWR or React Query

## Troubleshooting Tips
- Ensure proper import/export syntax
- Check for hydration errors when using client-side features
- Verify API routes follow the correct file structure
- Monitor bundle size for performance