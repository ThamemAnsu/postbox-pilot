# Authentication Troubleshooting Guide

## Common Issues & Solutions

### 1. API Connection Issues (400/500 errors)

**Check the browser console:**
- Open DevTools (F12) and check the Console tab
- You should see: `API Base URL: http://localhost:3000`
- Verify this matches your backend URL

**If your backend runs on a different URL/port:**
1. Create/edit `.env` file in the project root
2. Set: `VITE_API_URL=http://localhost:YOUR_PORT`
3. Restart the dev server (`npm run dev`)

### 2. CORS Errors (Network tab shows CORS policy error)

**This must be fixed in your backend**, not the frontend.

In your backend's `src/app.js` or wherever CORS is configured:

```javascript
// Option 1: Set environment variable
// CORS_ORIGIN=http://localhost:8080

// Option 2: Update CORS middleware
app.use(cors({
  origin: 'http://localhost:8080', // Vite dev server
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

**Multiple origins:**
```javascript
const allowedOrigins = [
  'http://localhost:8080',  // Vite
  'http://localhost:3000',  // Alternative
  'https://your-production-domain.com'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
```

### 3. Validation Errors (400 Bad Request)

Check the console for detailed error messages. Common issues:
- Email format invalid
- Password too short (< 8 characters)
- Missing required fields

### 4. Network Request Details

Open DevTools → Network tab:
1. Try to login/register
2. Click on the failed request (it will be red)
3. Check:
   - **Headers tab**: Verify the URL and request headers
   - **Payload tab**: Verify the data being sent
   - **Response tab**: See the exact error from backend

### Quick Checklist

- [ ] Backend server is running
- [ ] Frontend can reach backend URL (check console for "API Base URL")
- [ ] Backend CORS allows `http://localhost:8080`
- [ ] No browser console errors
- [ ] Network tab shows requests are being sent
- [ ] Backend logs show incoming requests

### Still Having Issues?

1. Check backend logs for incoming requests
2. Test backend directly with curl:
   ```bash
   curl -X POST http://localhost:3000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password123"}'
   ```
3. Compare frontend request (from DevTools Network tab) with working curl request
