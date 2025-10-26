# UI Components

This directory contains reusable UI components built with shadcn/ui patterns and Tailwind CSS.

## Components

### Button
The Button component provides a flexible button implementation with multiple variants and sizes.

**Props:**
- `variant`: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
- `size`: "default" | "sm" | "lg" | "icon"
- All standard HTML button attributes

**Usage:**
```tsx
import { Button } from "@/components/ui/button";

<Button variant="default" size="default">Click me</Button>
```

## Installation

These components follow shadcn/ui patterns and use Tailwind CSS for styling. They are fully customizable through className props.

