# Website Design Guidelines

## Overview
Modern AI/tech company landing page with soft gradients, glassmorphism effects, and warm color palette (peach/coral/purple/blue tones).

## Design System

### Colors
```css
:root {
  /* Background */
  --bg-cream: #F5F3F0;

  /* Primary */
  --primary-coral: #FF6B4A;
  --primary-orange: #FF8C42;

  /* Secondary - Purple/Blue gradients */
  --secondary-purple: #9B4DFF;
  --secondary-blue: #4D7CFF;

  /* Text */
  --text-dark: #2D2D2D;
  --text-muted: #6B6B6B;

  /* Accent */
  --accent-teal: #4DFFB4;
}
```

### Typography
- **Headings:** Serif font (Playfair Display or Fraunces)
- **Body:** Sans-serif (Inter)
- **Hero text:** Large with italic emphasis on key words

```css
/* Typography Scale */
--font-heading: 'Playfair Display', serif;
--font-body: 'Inter', sans-serif;

--text-xs: 0.75rem;
--text-sm: 0.875rem;
--text-base: 1rem;
--text-lg: 1.125rem;
--text-xl: 1.25rem;
--text-2xl: 1.5rem;
--text-3xl: 1.875rem;
--text-4xl: 2.25rem;
--text-5xl: 3rem;
--text-6xl: 3.75rem;
--text-7xl: 4.5rem;
```

### Spacing
```css
--space-1: 0.25rem;
--space-2: 0.5rem;
--space-3: 0.75rem;
--space-4: 1rem;
--space-6: 1.5rem;
--space-8: 2rem;
--space-12: 3rem;
--space-16: 4rem;
--space-24: 6rem;
--space-32: 8rem;
```

### Border Radius
```css
--radius-sm: 8px;
--radius-md: 12px;
--radius-lg: 16px;
--radius-xl: 24px;
--radius-2xl: 32px;
--radius-full: 9999px;
```

## Key Visual Elements

### Glassmorphism Cards
```css
.glass-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-xl);
}
```

### Gradient Blobs
```css
.gradient-blob {
  position: absolute;
  background: radial-gradient(circle at 30% 50%, #FF6B4A, #9B4DFF);
  filter: blur(60px);
  opacity: 0.6;
  border-radius: 50%;
  z-index: -1;
}
```

### Dot Matrix Pattern
```css
.dot-matrix {
  background-image: radial-gradient(circle, var(--text-dark) 1px, transparent 1px);
  background-size: 20px 20px;
}
```

### Gradient Text
```css
.gradient-text {
  background: linear-gradient(135deg, var(--primary-coral), var(--secondary-purple), var(--secondary-blue));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

## Page Sections

### 1. Hero
- Large serif heading with italicized key words
- Dot matrix graphic with orange/blue gradient overlay
- Two CTAs: primary dark button, secondary outline button
- Floating gradient orbs in background

### 2. Stats Cards
- Three glassmorphic cards on teal/orange gradient background
- Large numbers (48pt+) with short descriptions
- Subtle hover lift effect

### 3. Feature Sections
- Alternating left/right layout
- Sections: Discover, Build, Deploy, Optimize
- Each with floating gradient visual elements
- Generous whitespace between sections

### 4. Quote/Testimonial
- Full-width card with gradient background
- Large serif quote text
- Blurred imagery behind text
- Author attribution below

### 5. Results Section
- Timeline/list style with custom icons
- Two-column layout on desktop
- Checkmarks or numbered steps

### 6. Product Cards
- Dark themed cards (#1a1a1a background)
- Gradient overlay accents
- Side-by-side on desktop, stacked on mobile
- Hover glow effect

### 7. Team Section
- Grid of portrait images (3-4 columns)
- Rounded corners on images
- Name and role on hover or below

### 8. FAQ Accordion
- Expandable items with + / - icons
- Smooth expand animation
- Clean minimal borders

### 9. Footer CTA
- Large gradient card spanning full width
- Bold headline with conversion prompt
- Final call-to-action button

## Technical Requirements

### Responsive Breakpoints
```css
/* Mobile first */
--breakpoint-sm: 640px;
--breakpoint-md: 768px;
--breakpoint-lg: 1024px;
--breakpoint-xl: 1280px;
--breakpoint-2xl: 1536px;
```

### Animations
- Smooth scroll behavior
- Intersection Observer for scroll-triggered animations
- Hover effects: scale(1.02) on cards, color transitions on buttons
- Transition duration: 200-300ms
- Easing: cubic-bezier(0.4, 0, 0.2, 1)

### Layout
- CSS Grid for page structure
- Flexbox for component layouts
- Max content width: 1280px
- Side padding: 1rem (mobile) / 2rem (desktop)

## Button Styles

### Primary Button
```css
.btn-primary {
  background: var(--text-dark);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-full);
  font-weight: 500;
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
```

### Secondary Button
```css
.btn-secondary {
  background: transparent;
  color: var(--text-dark);
  padding: 0.75rem 1.5rem;
  border: 2px solid var(--text-dark);
  border-radius: var(--radius-full);
  font-weight: 500;
  transition: background 0.2s, color 0.2s;
}

.btn-secondary:hover {
  background: var(--text-dark);
  color: white;
}
```

## Build Order
1. Set up base styles and CSS variables
2. Hero section
3. Stats cards
4. Feature sections (one at a time)
5. Quote/testimonial
6. Results section
7. Product cards
8. Team section
9. FAQ accordion
10. Footer CTA
11. Responsive adjustments
12. Animations and polish
