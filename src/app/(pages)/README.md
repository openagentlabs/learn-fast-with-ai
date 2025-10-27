# Pages Directory

## Overview
This directory contains pages organized using Next.js **route groups**. Route groups (folders wrapped in parentheses) allow you to organize your code structure without affecting the URL paths.

## Purpose
Organize all pages in a dedicated folder while keeping URLs clean at the root level.

## Directory Structure
```
src/app/(pages)/
  ├── README.md          (this file)
  ├── test/
  │   └── page.tsx       → /test
  ├── about/
  │   └── page.tsx       → /about
  └── contact/
      └── page.tsx       → /contact
```

## How It Works
- Folders wrapped in parentheses like `(pages)` are **route groups**
- Route groups **don't appear in the URL path**
- A page at `(pages)/test/page.tsx` is accessible at `/test` (not `/pages/test`)

## Usage Examples

### Creating a New Page

To create a page accessible at `/newpage`:

1. Create a new folder: `src/app/(pages)/newpage/`
2. Add the page component: `src/app/(pages)/newpage/page.tsx`

```typescript
export default function NewPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">New Page</h1>
    </div>
  );
}
```

3. The page will be accessible at: `http://www.keith.com/newpage`

### Folder Structure Pattern

```
(pages)/
  └── [your-page-name]/
      ├── page.tsx          (required - main page component)
      ├── layout.tsx        (optional - nested layout)
      ├── loading.tsx       (optional - loading UI)
      ├── error.tsx         (optional - error UI)
      ├── not-found.tsx     (optional - 404 UI)
      └── README.md         (optional - page documentation)
```

## Current Pages

### Test Page
- **Location**: `src/app/(pages)/test/page.tsx`
- **URL**: `/test`
- **Description**: Example test page demonstrating the route group pattern

## Best Practices

1. **One Page per Folder**: Each route should have its own subfolder
2. **Consistent Naming**: Use kebab-case for folder names
3. **Documentation**: Add a README.md to complex pages
4. **Components**: Keep page-specific components in the same folder
5. **Layouts**: Use nested layouts when pages share common structure

## Route Groups vs Regular Folders

| Type | Example Path | URL | Purpose |
|------|-------------|-----|---------|
| Route Group | `(pages)/test/page.tsx` | `/test` | Organize code without affecting URL |
| Regular Folder | `docs/test/page.tsx` | `/docs/test` | Create nested routes |

## Related Documentation
- [Next.js Route Groups](https://nextjs.org/docs/app/building-your-application/routing/route-groups)
- [Next.js File Conventions](https://nextjs.org/docs/app/api-reference/file-conventions)
- [Next.js App Router](https://nextjs.org/docs/app)

