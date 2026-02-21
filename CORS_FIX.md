# CORS Error Fix - API Proxy

## Problem
The backend API (`https://kaffak.company/kaffak/webservice/`) doesn't allow requests from `http://localhost:3000` due to CORS (Cross-Origin Resource Sharing) restrictions.

**Error Message:**
```
Access to XMLHttpRequest at 'https://kaffak.company/kaffak/webservice/signup' 
from origin 'http://localhost:3000' has been blocked by CORS policy: 
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

## Solution
Created a **Next.js API Proxy** that routes all API requests through the Next.js server, bypassing CORS restrictions.

### How It Works

**Before (Direct API Call - Blocked by CORS):**
```
Browser (localhost:3000) → Backend API (kaffak.company)
❌ BLOCKED by CORS
```

**After (Proxy - Works):**
```
Browser (localhost:3000) → Next.js Proxy (/api/proxy) → Backend API (kaffak.company)
✅ Works! Next.js server makes the request, not the browser
```

### Files Modified

1. **`app/api/proxy/route.ts`** (NEW)
   - Next.js API route that proxies requests to the backend
   - Handles both GET and POST requests
   - Adds logging for debugging

2. **`lib/api.ts`** (UPDATED)
   - Detects development mode
   - Routes requests through proxy in development
   - Direct API calls in production

### Code Changes

#### `lib/api.ts`
```typescript
// Use proxy in development to avoid CORS issues
const USE_PROXY = process.env.NODE_ENV === 'development';

const apiClient = axios.create({
  baseURL: USE_PROXY ? '/api/proxy' : API_CONFIG.BASE_URL,
  // ... rest of config
});
```

### Testing

1. **Start the dev server:**
   ```bash
   npm run dev
   ```

2. **Try to sign up:**
   - Go to http://localhost:3000/signup
   - Fill in the form
   - Click "Sign Up"

3. **Check the console:**
   - You should see `Proxy GET: https://kaffak.company/kaffak/webservice/signup?...`
   - The request should now succeed (no CORS error)

### Production Deployment

In production (when you build with `npm run build`), the app will:
- Use direct API calls (no proxy needed)
- Work on the same domain (no CORS issues)

### Benefits

✅ **No CORS errors** - Requests go through Next.js server
✅ **No backend changes needed** - Works with existing API
✅ **Development only** - Production uses direct calls
✅ **Logging** - Can see all API requests in console

### Troubleshooting

If you still see errors:

1. **Check the proxy is working:**
   - Look for `Proxy GET:` or `Proxy POST:` in the console
   - Verify the URL is correct

2. **Check backend response:**
   - The proxy logs errors from the backend
   - Look for `Proxy error:` in the console

3. **Restart the dev server:**
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

### Notes

- The proxy only runs in development mode
- In production, requests go directly to the backend
- No changes needed to the backend API
- All existing API calls work automatically with the proxy

---

**Status:** ✅ CORS Error Fixed
**Date:** 2026-02-21
