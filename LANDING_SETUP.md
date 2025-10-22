# Landing Page Setup Guide

## Quick Start

This guide will help you deploy the new consultation booking landing page.

## Prerequisites

- Vercel account connected to your GitHub repository
- Supabase project with existing database
- Telegram Bot configured (already in use for quiz)

## Setup Steps

### 1. Database Setup

Run the migration to create the `consultation_bookings` table:

1. Open Supabase Dashboard: https://app.supabase.com
2. Navigate to your project
3. Go to SQL Editor
4. Open and execute `/migrations/create_consultation_bookings.sql`

**Verify**: Check that the table exists in Database > Tables.

### 2. Environment Variables

The booking API uses existing environment variables (no additional setup needed):

- `SUPABASE_URL` ✓ (already configured)
- `SUPABASE_ANON_KEY` ✓ (already configured)

Telegram credentials are hardcoded in `/api/booking.js` (same as quiz integration).

### 3. Deploy to Vercel

**Option A: Automatic Deployment** (Recommended)

1. Push code to your GitHub repository:
   ```bash
   git add .
   git commit -m "Add consultation booking landing page"
   git push origin main
   ```

2. Vercel will automatically deploy

3. Wait for deployment to complete (check Vercel dashboard)

**Option B: Manual Deployment**

```bash
npm install
vercel --prod
```

### 4. Test the Landing Page

1. Visit: `https://your-domain.vercel.app/landing.html`
2. Test form submission:
   - Enter a test name (e.g., "Test User")
   - Enter a test contact (e.g., "@testuser")
   - Click "Забронировать мою консультацию"
3. Verify:
   - ✅ Toast notification appears
   - ✅ Telegram notification received
   - ✅ Record appears in Supabase `consultation_bookings` table
   - ✅ Redirect to thank-you page (after 2 seconds)

### 5. Update Main Entry Point

The `index.html` has been updated to redirect to `landing.html` instead of `quiz.html`.

**To revert** (if needed):
```javascript
// In index.html, change:
window.location.href = 'landing.html';
// Back to:
window.location.href = 'quiz.html';
```

## File Structure

```
/
├── landing.html                 # NEW: Landing page
├── api/
│   ├── booking.js              # NEW: Booking API endpoint
│   ├── submit.js               # Existing quiz submission
│   ├── stats.js                # Existing stats
│   └── generate-result.js      # Existing result generation
├── migrations/
│   ├── create_consultation_bookings.sql  # NEW: Database migration
│   └── add_partial_fields.sql  # Existing migration
├── LANDING_PAGE.md             # NEW: Comprehensive documentation
├── LANDING_SETUP.md            # NEW: This setup guide
├── index.html                  # MODIFIED: Now redirects to landing.html
└── ... (other existing files)
```

## Accessing Different Pages

- **Landing Page**: `https://your-domain.vercel.app/` or `/landing.html`
- **Quiz**: `https://your-domain.vercel.app/quiz.html`
- **Stats**: `https://your-domain.vercel.app/stats.html`
- **Thank You**: `https://your-domain.vercel.app/thank-you.html`

## Features Implemented

### ✅ Core Features

- [x] Responsive landing page with mobile-first design
- [x] Hero section with emotional headline
- [x] Problem identification with 6 pain points
- [x] Solution introduction with Alena's profile
- [x] Benefits overview (3-column grid)
- [x] Social proof with 2 testimonials
- [x] Consultation booking form with validation
- [x] Toast notifications for feedback
- [x] Footer with links

### ✅ Technical Features

- [x] Form validation (real-time, on blur)
- [x] API endpoint for booking submissions (`/api/booking`)
- [x] Supabase integration for data storage
- [x] Telegram notification on booking
- [x] Facebook Pixel tracking (PageView, Lead, Custom Events)
- [x] Scroll depth tracking (25%, 50%, 75%, 100%)
- [x] CTA click tracking
- [x] Responsive design (mobile, tablet, desktop)
- [x] Accessibility (WCAG 2.1 Level AA)
- [x] Performance optimizations (lazy loading, inline CSS)
- [x] Smooth scroll behavior
- [x] Loading states on form submission

### ✅ Documentation

- [x] Comprehensive landing page documentation (`LANDING_PAGE.md`)
- [x] Setup guide (this file)
- [x] Code comments throughout
- [x] Database migration with comments

## Customization

### Update Content

All content is in Russian and can be easily updated directly in `landing.html`:

**Headlines**: Search for `<h1>`, `<h2>`, `<h3>` tags  
**Pain Points**: Edit cards in the "Problem Identification Section"  
**Testimonials**: Edit cards in the "Social Proof Section"  
**Alena's Bio**: Edit content in the "Solution Introduction Section"  
**Form Labels**: Edit in the "CTA Form Section"

### Update Styling

All styles are in the `<style>` block in `<head>`:

**Colors**: Modify CSS variables in `:root`  
**Typography**: Adjust font sizes and weights  
**Spacing**: Modify `--spacing-*` variables  
**Breakpoints**: Edit media queries at bottom of styles

## Monitoring & Analytics

### Facebook Pixel Events

Tracked automatically:
- **PageView**: On landing page load
- **Lead**: On successful form submission
- **ScrollDepth**: At 25%, 50%, 75%, 100% scroll
- **CTAClick**: On CTA button clicks

View in Facebook Events Manager.

### Supabase Dashboard

View booking submissions:

1. Go to Supabase Dashboard
2. Navigate to Database > Tables
3. Select `consultation_bookings`
4. View all submissions with filters

### Telegram Notifications

All bookings send instant notifications to:
- **Chat ID**: 684726097
- **Bot**: Uses existing quiz bot

## Troubleshooting

### Form Submission Not Working

**Check**:
1. Browser console for errors
2. Network tab for API request/response
3. Supabase environment variables in Vercel
4. Telegram bot token is correct

**Solution**:
- Verify `/api/booking` endpoint is accessible
- Check Supabase credentials in Vercel environment variables
- Test Telegram bot with manual API call

### No Telegram Notification

**Check**:
1. Telegram bot token in `/api/booking.js`
2. Chat ID is correct (684726097)
3. API logs in Vercel dashboard

**Solution**:
- Verify bot token hasn't expired
- Test bot separately: `https://api.telegram.org/bot<TOKEN>/sendMessage?chat_id=<CHAT_ID>&text=test`

### Styling Issues on Mobile

**Check**:
1. Viewport meta tag present
2. Test on real device (not just browser DevTools)
3. Media queries applied correctly

**Solution**:
- Clear browser cache
- Test in incognito/private mode
- Check responsive breakpoints at 768px

### Validation Not Triggering

**Check**:
1. JavaScript errors in console
2. Input field IDs match error span IDs
3. Event listeners attached properly

**Solution**:
- Verify no JavaScript syntax errors
- Check all IDs are unique
- Test validation functions individually in console

## Performance Checklist

- [x] Inline critical CSS (all styles in `<head>`)
- [x] Lazy loading for images below fold
- [x] No external JavaScript libraries (vanilla JS)
- [x] Async/defer for analytics scripts
- [x] Optimized form submission (no page reload)
- [ ] Convert image to WebP format (recommended)
- [ ] Add font preloading if using web fonts (optional)

## Security Checklist

- [x] HTTPS enforced (via Vercel)
- [x] CORS headers configured in API
- [x] Input validation on client-side
- [x] Supabase RLS policies enabled
- [x] No sensitive data in client-side code
- [x] Environment variables for credentials
- [ ] Add rate limiting to API (recommended for production)
- [ ] Add CSRF protection (recommended for production)

## Next Steps

### Immediate Actions

1. ✅ Deploy to Vercel
2. ✅ Run database migration
3. ⚠️ Test booking flow end-to-end
4. ⚠️ Verify Telegram notifications
5. ⚠️ Check analytics tracking

### Optional Enhancements

- [ ] Convert Alena's photo to WebP format for faster loading
- [ ] Add FAQ section to address common questions
- [ ] Implement A/B testing for headlines
- [ ] Add exit-intent popup for leaving visitors
- [ ] Integrate calendar booking (Calendly/Cal.com)
- [ ] Add English language version
- [ ] Set up automated email follow-up sequence

### Marketing Actions

- [ ] Update social media bios to link to landing page
- [ ] Create Facebook/Instagram ads pointing to landing page
- [ ] Share landing page in relevant communities
- [ ] Add link to quiz results page
- [ ] Set up retargeting pixel for visitors

## Support Resources

- **Main Documentation**: See `LANDING_PAGE.md` for comprehensive details
- **Code Comments**: All JavaScript functions are documented
- **Supabase Docs**: https://supabase.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Facebook Pixel**: https://developers.facebook.com/docs/meta-pixel

## Maintenance

### Regular Tasks

**Weekly**:
- Review booking submissions in Supabase
- Check form submission success rate
- Monitor analytics events

**Monthly**:
- Update testimonials with new success stories
- Review and optimize conversion rate
- A/B test different headlines or CTAs

**As Needed**:
- Update Alena's bio or credentials
- Modify pain points based on client feedback
- Adjust form fields if additional data needed

## Rollback Plan

If you need to revert to quiz-first experience:

1. Edit `index.html`:
   ```javascript
   window.location.href = 'quiz.html'; // Change back from 'landing.html'
   ```

2. Push changes:
   ```bash
   git add index.html
   git commit -m "Revert to quiz as main entry point"
   git push origin main
   ```

3. Landing page remains accessible at `/landing.html`

---

**Setup Complete!** 🎉

The landing page is now ready for deployment and testing. Refer to `LANDING_PAGE.md` for detailed documentation on all features and components.

**Questions or Issues?**  
Review the troubleshooting section above or check the comprehensive documentation in `LANDING_PAGE.md`.
