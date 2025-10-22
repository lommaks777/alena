# 📋 Quick Reference Guide

## 🚀 Quick Start (5 Minutes)

```bash
# 1. Run database migration
# Go to Supabase SQL Editor and execute:
migrations/create_consultation_bookings.sql

# 2. Deploy to Vercel
git add .
git commit -m "Add landing page"
git push origin main

# 3. Test
# Visit: https://your-domain.vercel.app/landing.html
```

## 🔗 Important URLs

| Page | URL |
|------|-----|
| Landing Page | `/landing.html` or `/` (redirects) |
| Quiz | `/quiz.html` |
| Stats | `/stats.html` |
| Thank You | `/thank-you.html` |

## 📁 Key Files

| File | Purpose |
|------|---------|
| `landing.html` | Main landing page |
| `api/booking.js` | Booking API endpoint |
| `migrations/create_consultation_bookings.sql` | Database setup |
| `LANDING_PAGE.md` | Full documentation |
| `LANDING_SETUP.md` | Setup guide |
| `IMPLEMENTATION_SUMMARY.md` | Implementation overview |

## 🎨 Quick CSS Customization

### Change Colors

Edit `:root` variables in `landing.html`:

```css
:root {
    --primary: #FFB6C1;      /* Main CTA color */
    --secondary: #6BB6FF;    /* Trust indicators */
    --success: #90EE90;      /* Success messages */
    --error: #FF6B6B;        /* Error messages */
}
```

### Change Fonts

```css
:root {
    --font-sans: 'Your Font', sans-serif;
}
```

### Change Spacing

```css
section {
    padding: var(--spacing-16) 0;  /* Change to --spacing-12 for less */
}
```

## ✏️ Quick Content Updates

### Update Headline

```html
<h1>Чувствуете себя потерянной в новой стране?</h1>
<!-- Change to your new headline -->
```

### Add Pain Point

```html
<div class="card">
    <div class="card-header">
        <h3 class="card-title">🔹 Your Title</h3>
    </div>
    <p class="card-description">Your description</p>
</div>
```

### Update Testimonial

```html
<div class="card testimonial">
    <p class="testimonial-quote">«Your quote»</p>
    <div class="testimonial-author">
        <div class="avatar">
            <div style="...">M</div> <!-- Initial -->
        </div>
        <div class="testimonial-info">
            <div class="testimonial-name">Name</div>
            <div class="testimonial-location">Location</div>
        </div>
        <span class="badge">Stage</span>
    </div>
</div>
```

## 🧪 Testing Checklist

### Quick Test (2 Minutes)

- [ ] Open `/landing.html`
- [ ] Fill form with test data
- [ ] Submit form
- [ ] Check Telegram for notification
- [ ] Verify Supabase record

### Full Test (10 Minutes)

- [ ] Test on mobile device
- [ ] Test all form validations
- [ ] Check all CTAs work
- [ ] Verify smooth scrolling
- [ ] Test accessibility (Tab key navigation)

## 🐛 Quick Troubleshooting

### Form Not Submitting

1. Open browser console (F12)
2. Check for JavaScript errors
3. Verify `/api/booking` endpoint exists
4. Check network tab for failed requests

**Fix**: Check Supabase environment variables in Vercel

### No Telegram Notification

1. Check API logs in Vercel dashboard
2. Verify bot token: `7329587114:AAFS0uK7roRVwwHB9c9w4-W6eKJlAaOUZkY`
3. Verify chat ID: `684726097`

**Test manually**:
```
https://api.telegram.org/bot7329587114:AAFS0uK7roRVwwHB9c9w4-W6eKJlAaOUZkY/sendMessage?chat_id=684726097&text=test
```

### Styling Broken on Mobile

1. Clear browser cache
2. Test in incognito mode
3. Check viewport meta tag exists
4. Verify media queries at 768px

## 📊 View Analytics

### Facebook Events Manager

1. Go to: https://business.facebook.com/events_manager
2. Select your pixel (ID: 829656679514883)
3. View events: PageView, Lead, ScrollDepth, CTAClick

### Supabase Dashboard

1. Go to: https://app.supabase.com
2. Select project
3. Database → Tables → `consultation_bookings`
4. View all submissions

### Vercel Analytics

1. Go to Vercel dashboard
2. Select project
3. Analytics tab
4. View traffic and performance

## 🔄 Common Tasks

### Switch Back to Quiz

Edit `index.html`:
```javascript
window.location.href = 'quiz.html'; // Change from 'landing.html'
```

### Add New Form Field

```html
<div class="form-group">
    <label for="field-id" class="label label-required">Label</label>
    <input type="text" id="field-id" class="input" required>
    <span id="field-id-error" class="input-error"></span>
</div>
```

Add validation:
```javascript
function validateNewField() {
    const value = document.getElementById('field-id').value.trim();
    if (!value) {
        showError(input, errorElement, 'Error message');
        return false;
    }
    clearError(input, errorElement);
    return true;
}
```

### Update Booking Status

```sql
UPDATE consultation_bookings
SET status = 'contacted'
WHERE id = 'uuid-here';
```

## 🎯 Performance Quick Wins

### Optimize Image

```bash
# Convert to WebP
# Use online tool or:
cwebp IMG_5365.JPG -o IMG_5365.webp
```

Update HTML:
```html
<picture>
    <source srcset="/IMG_5365.webp" type="image/webp">
    <img src="/IMG_5365.JPG" alt="Alena">
</picture>
```

### Minify HTML

Use online minifier or:
```bash
npm install -g html-minifier
html-minifier landing.html -o landing.min.html
```

## 📱 Responsive Breakpoints

| Device | Width | Columns |
|--------|-------|---------|
| Mobile | < 768px | 1 |
| Tablet | 768px - 1024px | 2 |
| Desktop | > 1024px | 3 |

## 🔐 Environment Variables

Set in Vercel dashboard:

| Variable | Value | Source |
|----------|-------|--------|
| `SUPABASE_URL` | Your Supabase URL | Already configured |
| `SUPABASE_ANON_KEY` | Your anon key | Already configured |

## 📞 Support Resources

| Resource | Link/Location |
|----------|---------------|
| Full Documentation | `LANDING_PAGE.md` |
| Setup Guide | `LANDING_SETUP.md` |
| Implementation Summary | `IMPLEMENTATION_SUMMARY.md` |
| Supabase Docs | https://supabase.com/docs |
| Vercel Docs | https://vercel.com/docs |

## ⚡ Quick Commands

```bash
# Install dependencies
npm install

# Deploy to production
vercel --prod

# View logs
vercel logs

# View deployments
vercel ls
```

## 🎨 Component Classes Quick Reference

```html
<!-- Buttons -->
<button class="btn btn-primary">Primary</button>
<button class="btn btn-primary btn-lg">Large Primary</button>
<button class="btn btn-ghost">Ghost</button>

<!-- Cards -->
<div class="card">Card content</div>

<!-- Badges -->
<span class="badge">Default</span>
<span class="badge badge-secondary">Secondary</span>
<span class="badge badge-success">Success</span>

<!-- Grid -->
<div class="grid grid-2">Two columns</div>
<div class="grid grid-3">Three columns</div>

<!-- Avatar -->
<div class="avatar"><img src="..."></div>
<div class="avatar avatar-lg"><img src="..."></div>

<!-- Form -->
<input type="text" class="input">
<input type="text" class="input error">
<input type="text" class="input success">
```

## 🔍 Search & Replace Guide

### Change Language from Russian to English

Find all Russian text and replace. Key phrases:

| Russian | English |
|---------|---------|
| Бесплатная консультация | Free Consultation |
| Забронировать | Book Now |
| Спасибо | Thank You |

### Change Telegram Credentials

In `api/booking.js`:
```javascript
const TELEGRAM_BOT_TOKEN = 'your-new-token';
const TELEGRAM_CHAT_ID = 'your-new-chat-id';
```

---

**Need more help?** Check `LANDING_PAGE.md` for comprehensive documentation.
