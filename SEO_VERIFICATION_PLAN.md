# 🔍 **Post-Implementation SEO Verification Plan**

## **1. Redirect Verification**

### **Test Commands:**

```bash
# Test non-www HTTP → www HTTPS
curl -I http://safaricomshopruaka.co.ke/

# Test non-www HTTPS → www HTTPS
curl -I https://safaricomshopruaka.co.ke/

# Test www version returns 200
curl -I https://www.safaricomshopruaka.co.ke/
```

### **Expected Headers:**

- **Non-www responses:** `HTTP/1.1 301 Moved Permanently`
- **Location header:** `https://www.safaricomshopruaka.co.ke/`
- **Cache-Control:** `public, max-age=0, must-revalidate` (or similar)
- **www response:** `HTTP/1.1 200 OK`

### **Online Tools:**

- **RedirectChecker.org** - Test both http/https versions
- **HTTPStatus.io** - Verify status codes and headers

---

## **2. Canonical Tag Verification**

### **Check Current Implementation:**

```bash
# Check homepage canonical
curl -s https://www.safaricomshopruaka.co.ke/ | grep -i canonical

# Check blog page canonical
curl -s https://www.safaricomshopruaka.co.ke/blog | grep -i canonical

# Check individual blog post canonical
curl -s https://www.safaricomshopruaka.co.ke/blog/some-post | grep -i canonical
```

### **Expected Canonical Format:**

```html
<link rel="canonical" href="https://www.safaricomshopruaka.co.ke/page-path" />
```

### **Next.js Dynamic Canonical (Reference Only):**

```javascript
// In _app.js or individual pages
import Head from "next/head";

<Head>
  <link
    rel="canonical"
    href={`https://www.safaricomshopruaka.co.ke${router.asPath}`}
  />
</Head>;
```

---

## **3. Sitemap Verification & Submission**

### **Check Sitemap URLs:**

```bash
# Verify sitemap only contains www URLs
curl -s https://www.safaricomshopruaka.co.ke/sitemap.xml | grep -o 'https://[^<]*' | head -10
```

### **Expected Sitemap Format:**

```xml
<url>
  <loc>https://www.safaricomshopruaka.co.ke/</loc>
  <lastmod>2024-01-15</lastmod>
  <changefreq>daily</changefreq>
  <priority>1.0</priority>
</url>
```

### **GSC Sitemap Submission:**

1. **Go to:** GSC → Sitemaps → Add a new sitemap
2. **Enter:** `sitemap.xml` (relative path)
3. **Submit and wait** for "Success" status
4. **Check:** Coverage report for indexed pages

---

## **4. GSC Property Setup**

### **Current Situation Analysis:**

- **Domain Property:** `safaricomshopruaka.co.ke` (covers both www and non-www)
- **URL-prefix Property:** `https://www.safaricomshopruaka.co.ke/` (www only)

### **Recommended Configuration:**

1. **Keep both properties** temporarily
2. **Set URL-prefix as primary** for detailed tracking
3. **Use Domain Property** for overall domain health
4. **Change of Address:** Only works with URL-prefix properties

### **GSC Settings:**

- **Primary property:** `https://www.safaricomshopruaka.co.ke/`
- **Change of Address:** From non-www to www (URL-prefix only)

---

## **5. Robots.txt and Crawlability**

### **Check Robots.txt:**

```bash
# Test www robots.txt
curl https://www.safaricomshopruaka.co.ke/robots.txt

# Test non-www robots.txt (should redirect)
curl https://safaricomshopruaka.co.ke/robots.txt
```

### **Expected Content:**

```
User-agent: *
Allow: /
Sitemap: https://www.safaricomshopruaka.co.ke/sitemap.xml
```

---

## **6. Monitoring & Safety**

### **Post-Redirect Monitoring Checklist:**

- [ ] **Coverage Report:** Check for "Duplicate without user-selected canonical" warnings
- [ ] **Index Status:** Verify www pages are indexed, non-www show redirects
- [ ] **Canonical Consistency:** All pages have www canonicals
- [ ] **Sitemap Status:** Shows "Success" in GSC
- [ ] **Search Results:** Only www URLs appear in search

### **Things to AVOID Until Google Reprocesses:**

- ❌ **Don't delete** old GSC properties yet
- ❌ **Don't change** robots.txt structure
- ❌ **Don't modify** sitemap format
- ❌ **Don't remove** redirects
- ❌ **Don't change** canonical tag implementation

### **Timeline Expectations:**

- **Immediate:** Redirects and canonicals should work
- **1-3 days:** GSC data starts updating
- **1-2 weeks:** Change of Address processes
- **2-4 weeks:** Full data consolidation

---

## **7. Final Confirmation**

### **Verification Complete When:**

✅ **All redirects return 301** with correct Location headers  
✅ **All pages have www canonicals**  
✅ **Sitemap contains only www URLs**  
✅ **GSC sitemap shows "Success"**  
✅ **No robots.txt blocking**  
✅ **Coverage report shows no duplicate content warnings**  
✅ **Search results show only www URLs**

### **Ready for Implementation When:**

- All verification steps pass
- GSC data is stable for 1-2 weeks
- No critical issues in coverage reports
- Change of Address tool shows "Processing" or "Complete"

**Next Phase:** Once verified, we can proceed with any necessary code optimizations or GSC property consolidation.

---

## **📝 Quick Reference Commands**

### **One-liner Verification:**

```bash
# Test all redirects at once
echo "Testing redirects..." && \
curl -I http://safaricomshopruaka.co.ke/ | head -1 && \
curl -I https://safaricomshopruaka.co.ke/ | head -1 && \
curl -I https://www.safaricomshopruaka.co.ke/ | head -1

# Check canonical tags
curl -s https://www.safaricomshopruaka.co.ke/ | grep -i canonical

# Verify sitemap URLs
curl -s https://www.safaricomshopruaka.co.ke/sitemap.xml | grep -o 'https://[^<]*' | head -5
```

### **GSC Quick Checks:**

1. **Sitemaps:** `https://www.safaricomshopruaka.co.ke/sitemap.xml`
2. **Robots:** `https://www.safaricomshopruaka.co.ke/robots.txt`
3. **Coverage:** GSC → Coverage → Check for errors
4. **URL Inspection:** Test both www and non-www versions
