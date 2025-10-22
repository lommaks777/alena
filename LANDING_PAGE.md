# Landing Page Documentation

## Overview

The landing page (`landing.html`) is a conversion-focused page designed to attract and convert visitors into consultation bookings with Alena, an immigration adaptation coach for women.

**Primary Goal**: Convert visitors into qualified leads by collecting contact information and scheduling free 30-minute consultation sessions.

**Target Audience**: Women who have recently immigrated to a new country and are experiencing various stages of adaptation.

## Page Structure

The landing page follows a vertical scroll structure optimized for both mobile and desktop devices:

1. **Hero Section** - Captures attention with emotional headline and primary CTA
2. **Problem Identification** - Validates visitor struggles with relatable pain points
3. **Solution Introduction** - Presents Alena as the guide with personal experience
4. **Benefits Overview** - Articulates clear value propositions
5. **Social Proof** - Builds credibility through testimonials
6. **CTA Form** - Collects lead information with minimal friction
7. **Footer** - Provides legal and contact information

## Design System

### Color Palette

```css
--primary: #FFB6C1         /* Soft pink for CTAs and accents */
--primary-dark: #FF9BAB    /* Darker pink for gradients */
--secondary: #6BB6FF       /* Calming blue for trust indicators */
--secondary-dark: #5A9FE5  /* Darker blue */
--success: #90EE90         /* Soft green for success states */
--error: #FF6B6B           /* Gentle red for errors */
```

### Typography

- **Font Family**: Inter, system sans-serif stack
- **Heading Sizes**:
  - H1: 3rem (48px) - Desktop, 2rem (32px) - Mobile
  - H2: 2rem (32px) - Desktop, 1.5rem (24px) - Mobile
  - H3: 1.5rem (24px) - Desktop, 1.25rem (20px) - Mobile
- **Body Text**: 1rem (16px) with 1.6 line height

### Spacing System

Based on 4px units:
- `--spacing-4`: 1rem (16px)
- `--spacing-6`: 1.5rem (24px)
- `--spacing-8`: 2rem (32px)
- `--spacing-16`: 4rem (64px)

## Component Library

### Card Component

Used for discrete content blocks (pain points, benefits, testimonials).

```html
<div class="card">
    <div class="card-header">
        <h3 class="card-title">Title</h3>
    </div>
    <p class="card-description">Description text</p>
</div>
```

**Features**:
- Border, padding, and shadow
- Hover effect (lift and enhanced shadow)
- Responsive padding (2rem desktop, 1.5rem mobile)

### Button Component

Primary CTA buttons throughout the page.

```html
<a href="#booking" class="btn btn-primary btn-lg">Button Text</a>
```

**Variants**:
- `btn-primary`: Gradient background with shadow
- `btn-lg`: Larger size for prominent CTAs
- `btn-ghost`: Transparent background for secondary actions

**States**:
- Hover: Lift effect with enhanced shadow
- Loading: Spinner animation (`.loading` class)
- Disabled: Reduced opacity, no pointer events

### Form Components

#### Input Field

```html
<div class="form-group">
    <label for="input-id" class="label label-required">Label</label>
    <input type="text" id="input-id" class="input" required>
    <span id="input-id-error" class="input-error" role="alert"></span>
</div>
```

**States**:
- `.error`: Red border (validation failed)
- `.success`: Green border (validation passed)
- `:focus`: Pink border with glow

### Badge Component

Used for credentials, trust indicators, and testimonial stages.

```html
<span class="badge">Text</span>
<span class="badge badge-secondary">Text</span>
<span class="badge badge-success">Text</span>
```

### Avatar Component

Displays Alena's photo or client initials.

```html
<div class="avatar avatar-lg">
    <img src="/path/to/image.jpg" alt="Description">
</div>
```

### Toast Notification

Displays success/error messages after form submission.

```html
<div id="toast" class="toast toast-success">
    <span class="toast-message">Message text</span>
    <button class="toast-close">&times;</button>
</div>
```

**Usage**: Call `showToast(message, type)` from JavaScript.

## Form Validation

### Validation Rules

| Field | Rules | Error Messages |
|-------|-------|----------------|
| Name | Required, min 2 characters | "Пожалуйста, введите ваше имя" / "Имя должно содержать минимум 2 символа" |
| Contact | Required, valid Telegram (@username) or phone number | "Пожалуйста, укажите контакт" / "Введите корректный Telegram или номер телефона" |

### Validation Behavior

- **Trigger**: Validation occurs on blur (when field loses focus)
- **Real-time**: After initial validation, re-validates on input
- **Visual Feedback**: 
  - Red border + error message (invalid)
  - Green border (valid)
- **Submit**: All fields must be valid before submission

### Implementation

```javascript
function validateName() {
    const value = nameInput.value.trim();
    if (!value) {
        showError(nameInput, nameError, 'Пожалуйста, введите ваше имя');
        return false;
    }
    if (value.length < 2) {
        showError(nameInput, nameError, 'Имя должно содержать минимум 2 символа');
        return false;
    }
    clearError(nameInput, nameError);
    return true;
}
```

## API Integration

### Endpoint: `/api/booking`

Handles consultation booking submissions.

**Method**: POST

**Request Body**:
```json
{
    "name": "Анна",
    "contact": "@username or +1234567890",
    "source": "landing-page",
    "timestamp": "2025-10-21T12:00:00Z"
}
```

**Response (Success)**:
```json
{
    "message": "Booking received successfully",
    "data": {
        "id": "uuid",
        "name": "Анна",
        "contact": "@username",
        "status": "pending"
    },
    "success": true
}
```

**Response (Error)**:
```json
{
    "message": "Internal Server Error",
    "error": "Error description",
    "success": false
}
```

### Data Storage

Bookings are stored in Supabase `consultation_bookings` table:

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name | TEXT | Visitor's name |
| contact | TEXT | Telegram/WhatsApp contact |
| source | TEXT | Source page (default: 'landing-page') |
| status | TEXT | Booking status (pending, contacted, scheduled, completed, cancelled) |
| notes | TEXT | Optional admin notes |
| created_at | TIMESTAMPTZ | Creation timestamp |
| updated_at | TIMESTAMPTZ | Last update timestamp |

### Telegram Notification

When a booking is submitted, a notification is sent to Alena via Telegram:

**Bot Token**: `7329587114:AAFS0uK7roRVwwHB9c9w4-W6eKJlAaOUZkY`  
**Chat ID**: `684726097`

**Message Format**:
```
🆕 Новая заявка на консультацию!

👤 Имя: Анна
📱 Контакт: @username
📍 Источник: landing-page
🕐 Время: 21.10.2025, 15:00
🔑 ID в базе: uuid
```

## Analytics Tracking

### Facebook Pixel Events

**PageView**: Tracked on page load (Meta Pixel Code in `<head>`)

**Lead**: Tracked on successful form submission
```javascript
fbq('track', 'Lead', {
    content_name: 'Consultation Booking',
    content_category: 'Landing Page'
});
```

**Custom Events**:
- `ScrollDepth`: Tracked at 25%, 50%, 75%, 100% scroll
- `CTAClick`: Tracked on CTA button clicks

### Implementation

```javascript
// Scroll depth tracking
window.addEventListener('scroll', () => {
    const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    // Track depth milestones
});

// CTA click tracking
document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('click', (e) => {
        fbq('trackCustom', 'CTAClick', {
            buttonText: btn.textContent.trim(),
            section: btn.closest('section')?.id
        });
    });
});
```

## Responsive Design

### Breakpoints

| Device | Viewport Width | Layout Changes |
|--------|----------------|----------------|
| Mobile | < 768px | Single column, stacked sections, full-width CTAs |
| Tablet | 768px - 1024px | Two-column grids where appropriate |
| Desktop | > 1024px | Full multi-column layout (3-column grids) |

### Key Mobile Adaptations

```css
@media (max-width: 768px) {
    h1 { font-size: 2rem; }
    .grid-2, .grid-3 { grid-template-columns: 1fr; }
    .btn-lg { width: 100%; }
    section { padding: 2rem 0; }
}
```

## Accessibility

### WCAG 2.1 Level AA Compliance

- **Keyboard Navigation**: All interactive elements accessible via Tab
- **Focus Indicators**: Visible 2px pink outline on `:focus-visible`
- **Color Contrast**: Minimum 4.5:1 for text
- **Form Labels**: Properly associated with inputs using `for`/`id`
- **ARIA Attributes**: 
  - `aria-required="true"` on required fields
  - `aria-describedby` for error messages
  - `role="alert"` on error spans
  - `aria-live="polite"` on toast notifications
- **Semantic HTML**: Proper heading hierarchy, landmark regions

### Screen Reader Support

```html
<input 
    type="text" 
    id="name" 
    aria-required="true"
    aria-describedby="name-error"
>
<span id="name-error" class="input-error" role="alert"></span>
```

## Performance Optimization

### Current Optimizations

1. **Inline Critical CSS**: All styles in `<head>` for above-fold content
2. **No External Dependencies**: Pure vanilla JavaScript, no libraries
3. **Optimized Images**: Use WebP format for Alena's photo
4. **Async/Defer Scripts**: Vercel Analytics loaded with `defer`
5. **Smooth Scroll**: CSS-based with `scroll-behavior: smooth`

### Recommendations

1. **Image Optimization**: Convert `/IMG_5365.JPG` to WebP format
2. **Lazy Loading**: Add `loading="lazy"` to images below fold
3. **Font Optimization**: Consider loading Inter font from Google Fonts with `font-display: swap`
4. **Minification**: Minify HTML/CSS in production build

## Maintenance Guide

### Content Updates

#### Updating Testimonials

Edit the testimonial cards in the "Social Proof Section":

```html
<div class="card testimonial">
    <p class="testimonial-quote">«Quote text»</p>
    <div class="testimonial-author">
        <div class="avatar">...</div>
        <div class="testimonial-info">
            <div class="testimonial-name">Name</div>
            <div class="testimonial-location">Location</div>
        </div>
        <span class="badge">Stage</span>
    </div>
</div>
```

#### Updating Pain Points

Edit cards in the "Problem Identification Section":

```html
<div class="card">
    <div class="card-header">
        <h3 class="card-title">🔹 Title</h3>
    </div>
    <p class="card-description">Description</p>
</div>
```

#### Updating Alena's Bio

Edit content in the "Solution Introduction Section".

### Technical Maintenance

#### Database Migration

To create the Supabase table, run:

```sql
-- Execute /migrations/create_consultation_bookings.sql
-- in Supabase SQL Editor
```

#### Environment Variables

Ensure Vercel environment variables are set:

- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Your Supabase anonymous key

#### Testing Form Submission

```javascript
// Test locally by submitting form
// Check browser console for logs
// Verify Telegram notification
// Confirm Supabase record creation
```

## Deployment

### Initial Setup

1. Push code to GitHub repository
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Run Supabase migration
5. Deploy

### Updates

Changes pushed to the main branch auto-deploy via Vercel's GitHub integration.

**Manual Deploy**: `vercel --prod`

## File Structure

```
/
├── landing.html              # Main landing page
├── api/
│   └── booking.js           # Booking submission endpoint
├── migrations/
│   └── create_consultation_bookings.sql  # Database schema
├── IMG_5365.JPG             # Alena's photo
└── LANDING_PAGE.md          # This documentation
```

## Troubleshooting

### Form Submission Fails

1. **Check browser console** for error messages
2. **Verify API endpoint** is accessible: `/api/booking`
3. **Check Supabase connection**: Ensure environment variables are set
4. **Test Telegram bot**: Verify bot token and chat ID

### Validation Not Working

1. **Check JavaScript errors** in console
2. **Verify input IDs** match error span IDs
3. **Test validation functions** individually

### Responsive Issues

1. **Test on actual devices** (not just browser DevTools)
2. **Check viewport meta tag** is present
3. **Verify media query breakpoints**

## Future Enhancements

### Potential Improvements

1. **Multi-language Support**: Add English version
2. **Calendar Integration**: Direct booking via Calendly/Cal.com
3. **A/B Testing**: Test different headlines and CTAs
4. **Progressive Disclosure**: Add FAQ accordion section
5. **Video Testimonials**: Embed video content
6. **Live Chat**: Add Telegram widget for instant contact
7. **Exit Intent Popup**: Capture leaving visitors
8. **Enhanced Analytics**: Google Analytics 4 integration

### Conversion Optimization

1. **A/B Test Headlines**: Different emotional appeals
2. **Test CTA Colors**: Primary vs. secondary color variants
3. **Form Field Order**: Test different sequences
4. **Social Proof Placement**: Test before vs. after benefits
5. **Trust Badges**: Add certifications, media mentions

## Support

For technical issues or questions:

- **Documentation**: This file
- **Codebase**: All code is well-commented
- **Supabase Docs**: https://supabase.com/docs
- **Vercel Docs**: https://vercel.com/docs

---

**Last Updated**: 2025-10-21  
**Version**: 1.0.0
