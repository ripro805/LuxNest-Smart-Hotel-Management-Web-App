# Quick Deploy Commands (বাংলায়)

## 🚀 Deployment এর জন্য Quick Steps

### 1️⃣ Backend Prepare করুন
```bash
cd backend
cp .env.example .env
# .env ফাইলে আপনার database credentials দিন
npm install
npm start  # Test করুন local এ
```

### 2️⃣ Frontend Prepare করুন
```bash
cd frontend
cp .env.example .env
# .env ফাইলে VITE_API_URL দিন
npm install
npm run build  # Production build test করুন
npm run preview  # Build preview দেখুন
```

### 3️⃣ GitHub এ Push করুন
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 4️⃣ Deploy করুন

**Backend (Railway):**
1. https://railway.app/ এ যান
2. MySQL database তৈরি করুন
3. Backend project import করুন (Root: `/backend`)
4. Environment variables সেট করুন (DEPLOYMENT.md দেখুন)

**Frontend (Vercel):**
1. https://vercel.com/ এ যান
2. Project import করুন (Root: `/frontend`)
3. Environment variable সেট করুন: `VITE_API_URL`
4. Deploy করুন

## ✅ Checklist

Deploy করার আগে check করুন:
- [ ] `.env.example` ফাইল আছে কিনা
- [ ] `.gitignore` এ `.env` আছে কিনা
- [ ] `database/hotel_management.sql` updated আছে কিনা
- [ ] Backend local এ run হচ্ছে কিনা
- [ ] Frontend local এ run হচ্ছে কিনা
- [ ] GitHub repository updated আছে কিনা

## 📚 Full Guide

বিস্তারিত guide এর জন্য দেখুন: [DEPLOYMENT.md](./DEPLOYMENT.md)

## 🆘 Quick Help

**Problem**: Database connection error
**Solution**: Railway MySQL credentials check করুন

**Problem**: CORS error
**Solution**: Backend এ `FRONTEND_URL` সঠিকভাবে সেট করুন

**Problem**: API calls failing
**Solution**: Frontend এ `VITE_API_URL` সঠিকভাবে সেট করুন এবং `/api` শেষে আছে কিনা check করুন
