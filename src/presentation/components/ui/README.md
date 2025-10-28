# UI Components

## Overview

This directory contains reusable UI components built with shadcn/ui patterns and Tailwind CSS v4.

**Location in Clean Architecture:** `src/presentation/components/ui/`

These UI components are part of the **presentation layer** in Clean Architecture because they:
- Handle user interactions and display
- Provide reusable UI building blocks
- Are consumed by both app layer (pages) and presentation layer (other components)

## Components

### Button
The Button component provides a flexible button implementation with multiple variants and sizes.

**Props:**
- `variant`: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
- `size`: "default" | "sm" | "lg" | "icon"
- All standard HTML button attributes

**Usage:**
```tsx
import { Button } from "@/presentation/components/ui/button";

<Button variant="default" size="default">Click me</Button>
```

### Input
The Input component provides a flexible input field with label and error message support.

**Props:**
- `label`: Optional label text
- `error`: Optional error message
- All standard HTML input attributes

**Usage:**
```tsx
import { Input } from "@/presentation/components/ui/input";

<Input label="Email" type="email" placeholder="Enter email" />
```

### Table
Table components for structured data display.

**Components:**
- `Table` - Main table wrapper
- `TableHeader` - Table header section
- `TableBody` - Table body section
- `TableRow` - Table row
- `TableHead` - Table header cell
- `TableCell` - Table data cell

**Usage:**
```tsx
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/presentation/components/ui/table";

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Email</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>John Doe</TableCell>
      <TableCell>john@example.com</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

## Installation

These components follow shadcn/ui patterns and use Tailwind CSS for styling. They are fully customizable through className props.

## Clean Architecture Placement

**Why in Presentation Layer?**
- UI components handle user interactions (presentation concerns)
- They are reusable presentation building blocks
- They depend on no other layers (only React and Tailwind CSS)
- They are consumed by the app layer (routing/pages) and can be used by other presentation components

