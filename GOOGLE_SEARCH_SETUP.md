# Google Search Results Setup Guide

## Step 1: Test Your Rich Snippets

1. Go to: https://search.google.com/test/rich-results
2. Enter: `https://www.safaricomshopruaka.co.ke`
3. Click "Test URL"
4. You should see:
   - ✅ Organization schema
   - ✅ LocalBusiness schema
   - ✅ AggregateRating (4.875/5 stars)
   - ✅ OpeningHours
   - ✅ FAQPage (from homepage)

## Step 2: Request Indexing in Google Search Console

1. Go to: https://search.google.com/search-console
2. Select your property: `safaricomshopruaka.co.ke`
3. In the top search bar, enter: `https://www.safaricomshopruaka.co.ke`
4. Click "Request Indexing"
5. Wait for Google to recrawl (usually 1-7 days)

## Step 3: Set Site Name (Optional but Recommended)

1. In Google Search Console, go to **Settings**
2. Click **Site identity**
3. Set **Site name** to: `Safaricom Shop Ruaka`
4. Save changes

## Step 4: Submit Sitemap (If not already done)

1. In Google Search Console, go to **Sitemaps**
2. Add: `https://www.safaricomshopruaka.co.ke/sitemap.xml`
3. Submit

## What to Expect:

- **Immediate**: Rich Results Test will show structured data
- **1-3 days**: URL inspection will show updated content
- **1-2 weeks**: Search results may update with:
  - Site name: "Safaricom Shop Ruaka"
  - Star ratings showing
  - Business hours displayed
  - Better snippets

## Troubleshooting:

- If structured data isn't recognized, wait 24-48 hours after deployment
- Clear your site's cache if using a CDN
- Check for any validation errors in Search Console
