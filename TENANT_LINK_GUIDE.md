# Tenant Dashboard Token Link Implementation

## Overview
When a new tenant is created, they receive an email with a personalized link containing a JWT token. This token is used to authenticate them and load their dashboard without requiring a separate login.

## URL Format

### For Local Development
```
http://localhost:3000/?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### For Production
```
https://yourdomain.com/?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**IMPORTANT:** The token must be in the query parameter named `token` at the root path `/`, NOT `/api/dashboard`.

## How It Works

1. **Tenant Registration** → Backend creates tenant account and generates JWT token
2. **Email Sent** → Email contains dashboard link with token in URL
3. **Tenant Clicks Link** → Browser navigates to `http://localhost:3000/?token=...`
4. **Token Extraction** → AuthContext extracts token from URL
5. **Token Stored** → Token saved to localStorage
6. **Dashboard Loads** → Token used to fetch tenant-specific data
7. **URL Cleaned** → Token removed from URL bar for security

## Frontend Implementation (Already Done)

The frontend already handles this automatically:
- Extracts token from URL query parameter
- Stores it in localStorage
- Fetches dashboard data using the token
- Cleans up URL to hide the token from the address bar

## Backend Integration

When creating a new tenant, generate an email with this link:

```javascript
// Example backend code (Node.js/Express)
const jwt = require('jsonwebtoken');
const { generateTenantInvitationEmail } = require('../utils/tokenLinks');

// Create JWT token
const token = jwt.sign(
  {
    hostelId: tenant.hostelId,
    tenantId: tenant.id,
    iat: Math.floor(Date.now() / 1000)
  },
  process.env.JWT_SECRET,
  { expiresIn: '7d' } // Token valid for 7 days
);

// Generate email content
const emailBody = generateTenantInvitationEmail(
  tenant.name,
  token,
  'https://yourdomain.com' // Production URL
);

// Send email
await sendEmail({
  to: tenant.email,
  subject: 'Welcome to SOSA Tenant Portal - Access Your Dashboard',
  html: emailBody
});
```

## API Endpoint (Backend Reference)

Your backend should have this endpoint as per API specification:

```
GET /api/tenant/dashboard
Headers:
  Authorization: Bearer <JWT_TOKEN>
  Content-Type: application/json

Success Response (200):
{
  "tenant": { ... },
  "facilities": [...],
  "recentTickets": [...],
  "hostel": { ... },
  "room": { ... },
  "payments": { ... }
}

Error Response (401):
{
  "message": "Invalid or expired token"
}
```

## Using the Utility Functions

```typescript
import { 
  generateTenantDashboardLink,
  generateTenantInvitationEmail 
} from '@/utils/tokenLinks';

// Generate a dashboard link
const link = generateTenantDashboardLink(token, 'https://yourdomain.com');
// Output: https://yourdomain.com/?token=eyJ...

// Generate full email HTML
const emailBody = generateTenantInvitationEmail('John Doe', token);
```

## Token Security Best Practices

1. **Use HTTPS in Production** - Tokens in URLs should only be used with HTTPS
2. **Set Expiration** - Tokens should expire after 7 days
3. **Don't Log Tokens** - Avoid logging full tokens in production
4. **Clean URLs** - Frontend automatically removes token from URL bar
5. **Single Use** - Consider invalidating tokens after first use

## Testing

### Local Test URL
```
http://localhost:3000/?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJob3N0ZWxJZCI6IjZhMmZlYzU1ZmE2YWI0NjcyMTc1MjdmNyIsInRlbmFudElkIjoiNmEzNTBkYjdiMjA2YWEzNzQ3Yzc3MzdmIiwiaWF0IjoxNzgxODYxODE2fQ.bUwVJwrjfbaU8ir8cDYkI8wQ1r-zLaMoYVYPzIHtc7o
```

Open browser console (F12) and look for logs:
```
Token extracted from URL: eyJhbGciOiJIUzI1...
[Attempt 1] Fetching live dashboard...
```

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| 404 Not Found | URL path is wrong | Use `/?token=...` not `/api/dashboard?token=...` |
| 401 Unauthorized | Backend doesn't recognize token | Check token format matches JWT spec |
| Token in address bar | URL not cleaned | Check browser console for `history.replaceState` logs |
| Dashboard not loading | Token expired | Regenerate token with longer expiration |
| Blank page | Token extraction failed | Check console logs for URL parsing errors |
