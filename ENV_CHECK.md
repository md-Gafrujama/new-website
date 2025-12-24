# Environment Configuration Check

## ✅ Frontend .env File Status

**Location:** `new-website/frontend/.env`

### Current Configuration:
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_NAME=Admin Dashboard
NEXT_PUBLIC_ENVIRONMENT=development

# Authentication
NEXT_PUBLIC_JWT_STORAGE_KEY=adminToken
NEXT_PUBLIC_ADMIN_DATA_KEY=adminData
NEXT_PUBLIC_SESSION_TIMEOUT=86400000

# OTP Configuration
NEXT_PUBLIC_OTP_LENGTH=6
NEXT_PUBLIC_OTP_TIMEOUT=300000
NEXT_PUBLIC_MAX_OTP_ATTEMPTS=3

# UI Configuration
NEXT_PUBLIC_THEME_PRIMARY=#00BFA6
NEXT_PUBLIC_THEME_SECONDARY=#0A2540
NEXT_PUBLIC_THEME_BACKGROUND=#F5F7FA

# Company Information
NEXT_PUBLIC_COMPANY_NAME=Admin System
```

**Status:** ✅ All required variables are set correctly

---

## ✅ Backend .env File Status

**Location:** `new-website/backend/.env`

### Current Configuration:
```env
PORT=5000
NODE_ENV=development
HOST=localhost

MONGODB_URI=mongodb+srv://gs1234:gs1234@cluster0.ukhzl1s.mongodb.net/admin_auth_email?retryWrites=true&w=majority&appName=Cluster0
DB_NAME=admin_auth_email

JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345
JWT_EXPIRE=24h
JWT_REFRESH_SECRET=your_refresh_secret_key_67890
JWT_REFRESH_EXPIRE=7d

ADMIN_EMAIL=mdgafrujamaansri0786@gmail.com
ADMIN_PASSWORD=Admin@123

OTP_EXPIRY_MINUTES=5
MAX_OTP_ATTEMPTS=3
OTP_RESEND_DELAY_MINUTES=1

EMAIL_SERVICE=gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=mdgafrujamaansri0786@gmail.com
EMAIL_PASSWORD=eoaclcechmyavqpy
EMAIL_FROM=mdgafrujamaansri0786@gmail.com
EMAIL_FROM_NAME=Company Admin

BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

CORS_ORIGIN=http://localhost:3000
CORS_CREDENTIALS=true

LOG_LEVEL=info
ENABLE_LOGGING=true
```

**Status:** ✅ All required variables are set correctly

---

## ⚠️ Known Issues & Fixes

### 1. Port 3000 Already in Use

**Problem:** `Error: listen EADDRINUSE: address already in use :::3000`

**Solution:**
```bash
# Option 1: Kill the process using port 3000
# Windows PowerShell:
Get-Process -Id 42048 | Stop-Process -Force

# Or find and kill:
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F

# Option 2: Use a different port
# In frontend/.env, you can't change Next.js default port easily
# Better to kill the existing process
```

### 2. Next.js Start vs Dev

**Problem:** Using `next start` requires a build first

**Solution:**
```bash
# For development, use:
npm run dev
# or
next dev

# For production:
npm run build
npm start
```

### 3. MongoDB Connection

**Status:** ⚠️ Cluster may be paused - needs to be resumed in MongoDB Atlas

**Fix:** Go to https://cloud.mongodb.com and resume the cluster if paused

### 4. Gmail Authentication

**Status:** ⚠️ App Password may need to be regenerated

**Fix:** Generate a new App Password at https://myaccount.google.com/apppasswords

---

## 🚀 Quick Start Commands

### Backend:
```bash
cd new-website/backend
npm install  # if needed
nodemon
```

### Frontend:
```bash
cd new-website/frontend
npm install  # if needed
npm run dev  # Use 'dev' not 'start' for development
```

---

## ✅ Verification Checklist

- [x] Frontend .env file exists and is configured
- [x] Backend .env file exists and is configured
- [x] API URL matches (frontend: http://localhost:5000)
- [x] CORS origin matches (backend: http://localhost:3000)
- [ ] Port 3000 is free (kill existing process)
- [ ] MongoDB cluster is active (resume if paused)
- [ ] Gmail App Password is valid (regenerate if needed)

---

## 📝 Notes

- Both .env files are properly configured
- Frontend uses `NEXT_PUBLIC_*` prefix for client-side variables
- Backend uses standard environment variables
- Make sure to restart servers after changing .env files

