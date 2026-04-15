# JK Affiliate Store Landing Page - Technical Specification

**Document Version:** 1.0  
**Date:** April 10, 2026  
**Author:** Manus AI  
**Project:** jk-affiliate-landing

---

## Executive Summary

This document outlines the technical architecture and implementation strategy for the JK Affiliate Store landing page. The landing page serves as the public entry point for visitors, featuring an immersive hero section with scroll-based text reveal effects, interactive Women/Men category selection, and a seamless login flow that redirects authenticated users to the existing shopping page at `localhost:3000/`.

---

## 1. Design Philosophy & Visual Identity

### 1.1 Design Movement
**Luxury Fashion Editorial** – The landing page adopts a high-fashion editorial aesthetic, inspired by contemporary luxury brand campaigns. This approach emphasizes sophisticated typography, ample whitespace, and carefully curated imagery that conveys premium quality and aspirational lifestyle.

### 1.2 Core Design Principles

| Principle | Description |
|-----------|-------------|
| **Minimalist Elegance** | Clean layouts with strategic use of whitespace; avoid visual clutter and unnecessary elements. |
| **Typographic Hierarchy** | Bold, serif display fonts for headlines paired with refined sans-serif for body text; establish clear visual distinction. |
| **Subtle Motion** | Smooth scroll-triggered animations and hover effects that enhance user engagement without overwhelming the experience. |
| **Premium Color Palette** | Purple and white as primary colors, with carefully selected accent shades to reinforce brand identity. |

### 1.3 Color Philosophy

The purple and white color scheme conveys luxury, exclusivity, and sophistication. Purple represents creativity and premium positioning, while white provides breathing room and emphasizes content clarity. The palette is intentionally restrained to maintain elegance and avoid visual saturation.

**Color Specifications:**
- **Primary Purple:** `#7C3AED` (Vibrant Purple) or `#6D28D9` (Deep Purple)
- **Accent Purple:** `#A78BFA` (Light Purple) for secondary elements
- **Background:** `#FFFFFF` (White) with subtle off-white accents (`#F9F7FF`)
- **Text:** `#1F1F1F` (Near Black) for primary text; `#6B7280` (Gray) for secondary text

### 1.4 Typography System

| Font Role | Font Family | Weight | Use Case |
|-----------|-------------|--------|----------|
| **Display Headline** | Playfair Display or similar serif | 700–900 | Hero section text, category headers |
| **Body Text** | Poppins or Sora (sans-serif) | 400–600 | Descriptive text, navigation, CTA labels |
| **Accent/Tagline** | Playfair Display | 400–500 | Subtle taglines, section introductions |

### 1.5 Layout Paradigm

The landing page employs a **full-width, vertical scroll** layout with asymmetric sections:
- **Hero Section:** Full viewport height with background image and overlay text
- **Category Selection:** Horizontal toggle (Women | Men) with smooth transitions
- **Content Sections:** Alternating image-left/text-right and text-left/image-right layouts to avoid monotony
- **Call-to-Action Sections:** Centered, prominent buttons with supporting copy

### 1.6 Signature Visual Elements

1. **Scroll-Triggered Text Reveal:** Large typography that progressively appears as users scroll, with varying opacity and subtle parallax effects
2. **Interactive Hover Zones:** Specific areas where hovering reveals hidden text or imagery; creates tactile, exploratory interaction
3. **Gradient Overlays:** Subtle purple-to-transparent gradients over images to ensure text legibility and brand cohesion

### 1.7 Animation & Motion Guidelines

- **Scroll Animations:** Text fades in with a slight upward motion (50–100px) as users scroll into view; duration 600–800ms
- **Hover Effects:** Buttons and interactive elements scale slightly (1.02–1.05x) with a smooth 200–300ms transition
- **Parallax Scrolling:** Background images move at 0.5–0.7x the scroll speed to create depth
- **Category Toggle:** Smooth slide transition (300ms) when switching between Women and Men categories

---

## 2. Technical Architecture

### 2.1 Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | React 19 + TypeScript | Component-based UI with type safety |
| **Styling** | Tailwind CSS 4 + Custom CSS | Utility-first styling with design tokens |
| **Routing** | Wouter | Lightweight client-side routing |
| **Animation** | Framer Motion | Scroll-triggered and interactive animations |
| **UI Components** | shadcn/ui | Pre-built, accessible components |
| **Build Tool** | Vite | Fast development and optimized production builds |

### 2.2 Project Structure

```
client/
├── public/
│   ├── favicon.ico
│   └── robots.txt
├── src/
│   ├── pages/
│   │   ├── Home.tsx              # Landing page entry point
│   │   ├── LandingHero.tsx        # Hero section with scroll reveal
│   │   ├── CategorySelector.tsx   # Women | Men toggle
│   │   ├── LoginModal.tsx         # Login/authentication modal
│   │   └── NotFound.tsx           # 404 page
│   ├── components/
│   │   ├── ui/                    # shadcn/ui components
│   │   ├── ScrollRevealText.tsx   # Scroll-triggered text reveal
│   │   ├── HoverReveal.tsx        # Hover-triggered text/image reveal
│   │   ├── Header.tsx             # Navigation header
│   │   └── Footer.tsx             # Footer section
│   ├── hooks/
│   │   ├── useScrollReveal.ts     # Scroll event listener hook
│   │   ├── useInView.ts           # Intersection Observer hook
│   │   └── useAuth.ts             # Authentication state hook
│   ├── contexts/
│   │   ├── ThemeContext.tsx       # Theme provider
│   │   └── AuthContext.tsx        # Authentication context
│   ├── lib/
│   │   ├── animations.ts          # Animation utilities
│   │   ├── constants.ts           # App constants
│   │   └── utils.ts               # Helper functions
│   ├── App.tsx                    # Main app component with routing
│   ├── main.tsx                   # React entry point
│   └── index.css                  # Global styles and design tokens
├── index.html                     # HTML template
└── package.json                   # Dependencies and scripts
```

### 2.3 Component Architecture

#### **LandingHero Component**
- **Purpose:** Renders the full-screen hero section with background image and scroll-reveal text
- **Props:** `category` (Women | Men), `onCategoryChange` callback
- **State:** Scroll position, text opacity, parallax offset
- **Features:**
  - Full-viewport background image with gradient overlay
  - Large display text (e.g., "JK EDITION") that appears with scroll
  - Smooth parallax effect on background image
  - Responsive design for mobile/tablet/desktop

#### **CategorySelector Component**
- **Purpose:** Toggle between Women and Men categories
- **Props:** `active` (Women | Men), `onChange` callback
- **Features:**
  - Smooth slide animation on toggle
  - Appears after first scroll
  - Sticky positioning or fixed at top
  - Accessible keyboard navigation

#### **ScrollRevealText Component**
- **Purpose:** Reusable component for scroll-triggered text animations
- **Props:** `text` (string), `delay` (optional), `duration` (optional)
- **Features:**
  - Intersection Observer for performance
  - Configurable fade-in and slide-up animations
  - Supports staggered animations for multiple elements

#### **HoverReveal Component**
- **Purpose:** Interactive hover zones that reveal hidden text/imagery
- **Props:** `children` (content), `revealContent` (hidden text), `radius` (hover radius)
- **Features:**
  - Circular or rectangular hover detection
  - Smooth fade-in of revealed content
  - Configurable reveal radius

#### **LoginModal Component**
- **Purpose:** Authentication modal for user login
- **Props:** `isOpen` (boolean), `onClose` callback, `onSuccess` callback
- **Features:**
  - Email/password form or OAuth integration
  - Error handling and validation
  - Redirect to `localhost:3000/` on successful login

---

## 3. Feature Implementation Details

### 3.1 Hero Section with Scroll Reveal

**Behavior:**
1. Page loads with full-screen background image (Women category by default)
2. Large display text (e.g., "JK EDITION") is initially hidden or very transparent
3. As user scrolls down, text progressively appears with increasing opacity
4. Text moves slightly upward (parallax effect) as background image moves slower
5. At a certain scroll threshold, the "Women | Men" category selector appears at the top

**Implementation Strategy:**
- Use `window.addEventListener('scroll', ...)` or Framer Motion's `useScroll` hook to track scroll position
- Calculate text opacity based on scroll progress: `opacity = Math.min(scrollProgress, 1)`
- Apply parallax transform: `transform: translateY(scrollProgress * 50px)`
- Use CSS `will-change: transform, opacity` for performance optimization

**Code Skeleton:**
```tsx
// LandingHero.tsx
const [scrollProgress, setScrollProgress] = useState(0);

useEffect(() => {
  const handleScroll = () => {
    const progress = window.scrollY / window.innerHeight;
    setScrollProgress(Math.min(progress, 1));
  };
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);

return (
  <div className="relative w-full h-screen overflow-hidden">
    {/* Background Image with Parallax */}
    <div
      className="absolute inset-0 bg-cover bg-center"
      style={{
        backgroundImage: `url(${heroImage})`,
        transform: `translateY(${scrollProgress * 50}px)`,
      }}
    />
    
    {/* Gradient Overlay */}
    <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-white/40" />
    
    {/* Display Text with Scroll Reveal */}
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{ opacity: scrollProgress }}
    >
      <h1 className="text-8xl font-bold text-white">JK EDITION</h1>
    </div>
  </div>
);
```

### 3.2 Interactive Hover Reveal

**Behavior:**
1. User hovers over a specific area on the hero image
2. Hidden text or additional imagery appears within a circular or rectangular radius
3. The reveal fades in smoothly and disappears when hover ends
4. Multiple hover zones can exist on the same image

**Implementation Strategy:**
- Track mouse position with `onMouseMove` event
- Calculate distance from mouse to predefined reveal zones
- Show/hide content based on distance threshold (radius)
- Use CSS `pointer-events: none` on revealed content to prevent interaction interference

**Code Skeleton:**
```tsx
// HoverReveal.tsx
const [isHovering, setIsHovering] = useState(false);
const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

const handleMouseMove = (e: React.MouseEvent) => {
  const rect = e.currentTarget.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  setMousePos({ x, y });
  
  // Calculate distance to reveal zone center
  const distance = Math.hypot(x - revealCenterX, y - revealCenterY);
  setIsHovering(distance < revealRadius);
};

return (
  <div onMouseMove={handleMouseMove} onMouseLeave={() => setIsHovering(false)}>
    {/* Main Content */}
    {/* Revealed Content */}
    <div
      className="absolute transition-opacity duration-300"
      style={{ opacity: isHovering ? 1 : 0 }}
    >
      {revealContent}
    </div>
  </div>
);
```

### 3.3 Category Toggle (Women | Men)

**Behavior:**
1. Initially hidden; appears after user scrolls past a certain threshold (e.g., 20% of viewport height)
2. Two buttons: "Women" (active by default) and "Men"
3. Clicking a category smoothly transitions the hero image and text
4. Active category is highlighted with purple color; inactive is grayed out
5. Smooth slide animation when switching categories

**Implementation Strategy:**
- Use state to track active category
- Conditionally render category selector based on scroll position
- Preload both Women and Men images to prevent loading delays
- Use CSS transitions or Framer Motion for smooth image swaps

**Code Skeleton:**
```tsx
// CategorySelector.tsx
const [activeCategory, setActiveCategory] = useState('women');

const handleCategoryChange = (category: 'women' | 'men') => {
  setActiveCategory(category);
  // Trigger image and text transition
};

return (
  <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50">
    <div className="flex gap-4 bg-white/90 px-6 py-3 rounded-full shadow-lg">
      {['women', 'men'].map((cat) => (
        <button
          key={cat}
          onClick={() => handleCategoryChange(cat as 'women' | 'men')}
          className={`px-6 py-2 font-semibold transition-colors ${
            activeCategory === cat
              ? 'text-purple-700'
              : 'text-gray-400'
          }`}
        >
          {cat.toUpperCase()}
        </button>
      ))}
    </div>
  </div>
);
```

### 3.4 Login Flow & Authentication

**Behavior:**
1. User clicks "Login" or "Sign In" button (placed in header or CTA section)
2. Modal dialog opens with email/password form or OAuth options
3. On successful authentication, user is redirected to `localhost:3000/`
4. On error, display error message and allow retry

**Implementation Strategy:**
- Use shadcn/ui Dialog component for modal
- Implement form validation with React Hook Form + Zod
- Store authentication token in localStorage or session storage
- Redirect using `window.location.href = 'http://localhost:3000/'` or Wouter's router

**Code Skeleton:**
```tsx
// LoginModal.tsx
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [error, setError] = useState('');

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    // Call authentication API
    const response = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.ok) {
      const { token } = await response.json();
      localStorage.setItem('authToken', token);
      window.location.href = 'http://localhost:3000/';
    } else {
      setError('Invalid credentials');
    }
  } catch (err) {
    setError('Login failed');
  }
};

return (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit">Login</button>
      </form>
    </DialogContent>
  </Dialog>
);
```

### 3.5 Responsive Design

**Breakpoints:**
- **Mobile (< 640px):** Single column layout, smaller fonts, touch-friendly buttons
- **Tablet (640px – 1024px):** Two-column sections, medium fonts
- **Desktop (> 1024px):** Full multi-column layouts, large display fonts

**Mobile Considerations:**
- Reduce hero section height to 60–70vh for mobile
- Simplify hover reveal (replace with tap interaction)
- Stack category selector vertically on very small screens
- Ensure touch targets are at least 44x44px

---

## 4. Asset Management

### 4.1 Image Assets

All images must be uploaded using the `manus-upload-file --webdev` command to generate CDN URLs. Local image storage will cause deployment timeouts.

**Required Assets:**
- Women's hero background image(s)
- Men's hero background image(s)
- JK logo (SVG or PNG)
- Additional category/product images for lower sections

**Image Specifications:**
- **Hero Images:** Minimum 1920x1080px, optimized for web (< 500KB each)
- **Logo:** SVG preferred for scalability; if PNG, minimum 200x200px
- **Thumbnails:** 300x300px for category cards

### 4.2 SVG Elements

The design includes SVG overlays for text reveal effects. These SVGs should define:
- Large display typography (e.g., "JK EDITION", "WOMEN", "MEN")
- Animated paths for scroll-triggered reveals
- Gradient definitions for text styling

---

## 5. Performance Optimization

### 5.1 Lazy Loading
- Use `React.lazy()` and `Suspense` for route-based code splitting
- Implement Intersection Observer for below-the-fold content
- Preload critical images using `<link rel="preload">`

### 5.2 Animation Performance
- Use `will-change: transform, opacity` on animated elements
- Prefer `transform` and `opacity` over layout-affecting properties
- Debounce scroll event listeners to avoid excessive re-renders

### 5.3 Image Optimization
- Use modern formats (WebP with PNG fallback)
- Implement responsive images with `srcset` and `sizes`
- Compress images to < 200KB for thumbnails, < 500KB for hero images

---

## 6. Accessibility & SEO

### 6.1 Accessibility
- Ensure all interactive elements are keyboard-accessible
- Provide `aria-label` for icon-only buttons
- Maintain sufficient color contrast (WCAG AA minimum 4.5:1 for text)
- Use semantic HTML (`<button>`, `<nav>`, `<main>`, etc.)

### 6.2 SEO
- Add descriptive `<title>` and `<meta description>` tags
- Use semantic heading hierarchy (`<h1>`, `<h2>`, etc.)
- Include `alt` text for all images
- Implement Open Graph meta tags for social sharing

---

## 7. Testing & Validation

### 7.1 Browser Compatibility
- Test on Chrome, Firefox, Safari, and Edge (latest versions)
- Verify responsive design on mobile, tablet, and desktop
- Test touch interactions on actual mobile devices

### 7.2 Performance Testing
- Lighthouse audit: target 90+ scores for Performance, Accessibility, Best Practices
- Page load time: target < 3 seconds on 4G connection
- Smooth scrolling: maintain 60 FPS during scroll animations

### 7.3 User Testing
- Validate scroll reveal timing and opacity progression
- Test hover reveal interaction radius and smoothness
- Verify category toggle transitions are smooth and responsive
- Confirm login flow redirects correctly to `localhost:3000/`

---

## 8. Deployment & Launch

### 8.1 Build & Deployment
- Run `pnpm build` to generate optimized production build
- Deploy to Manus hosting platform with custom domain support
- Enable SSL/TLS for secure authentication

### 8.2 Post-Launch Monitoring
- Monitor Lighthouse scores and Core Web Vitals
- Track user interactions and scroll depth analytics
- Collect feedback on scroll reveal timing and interactivity

---

## 9. Future Enhancements

1. **Advanced Animations:** Add 3D transforms or WebGL effects for hero section
2. **Product Integration:** Display curated products from each category below hero
3. **Newsletter Signup:** Add email subscription form in footer
4. **User Personalization:** Remember user's category preference and show relevant content
5. **A/B Testing:** Test different hero images, text copy, and CTA placements

---

## 10. References

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [React 19 Documentation](https://react.dev/)
- [shadcn/ui Component Library](https://ui.shadcn.com/)
- [Web Accessibility Guidelines (WCAG)](https://www.w3.org/WAI/WCAG21/quickref/)
- [Web Vitals & Performance Optimization](https://web.dev/vitals/)

---

**Document Status:** Ready for Implementation  
**Last Updated:** April 10, 2026
