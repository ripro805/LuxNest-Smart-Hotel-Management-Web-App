# 🚀 LuxNest Deployment Guide (বাংলায়)

এই গাইডে আপনি শিখবেন কিভাবে আপনার LuxNest Hotel Management প্রজেক্ট সম্পূর্ণ ফ্রিতে deploy করবেন।

## 📋 Requirements

আপনার দরকার হবে:
- ✅ GitHub অ্যাকাউন্ট (ইতিমধ্যে আছে)
- ✅ Railway অ্যাকাউন্ট (Backend + Database এর জন্য)
- ✅ Vercel অ্যাকাউন্ট (Frontend এর জন্য)

---

## 🎯 Deployment Strategy

```
┌─────────────┐         ┌──────────────┐         ┌──────────────┐
│   Frontend  │  ────▶  │   Backend    │  ────▶  │   Database   │
│   (Vercel)  │         │  (Railway)   │         │  (Railway)   │
└─────────────┘         └──────────────┘         └──────────────┘
```

---

## 🗄️ Part 1: Database Setup (Railway)

### Step 1: Railway অ্যাকাউন্ট তৈরি করুন

1. যান: https://railway.app/
2. **"Start a New Project"** এ ক্লিক করুন
3. GitHub দিয়ে Login করুন

### Step 2: MySQL Database তৈরি করুন

1. Dashboard এ **"+ New"** বাটনে ক্লিক করুন
2. **"Database"** সিলেক্ট করুন → **"Add MySQL"**
3. Database তৈরি হয়ে গেলে, সেটিতে ক্লিক করুন

### Step 3: Database Credentials কপি করুন

**Variables** ট্যাবে গিয়ে এই মানগুলো নোট করে রাখুন:
```
MYSQLHOST=xxxx.railway.app
MYSQLPORT=xxxx
MYSQLDATABASE=railway
MYSQLUSER=root
MYSQLPASSWORD=xxxxxxxxxx
```

### Step 4: Database Import করুন

Railway Dashboard থেকে:

**Option A: Railway CLI দিয়ে (Recommended)**
```bash
# Railway CLI install করুন
npm i -g @railway/cli

# Login করুন
railway login

# আপনার project link করুন
railway link

# MySQL database এ connect করুন
railway connect MySQL

# Database import করুন
mysql -u root -p railway < database/hotel_management.sql
```

**Option B: phpMyAdmin/MySQL Workbench দিয়ে**
1. MySQL Workbench বা phpMyAdmin ব্যবহার করুন
2. Railway থেকে পাওয়া credentials দিয়ে connect করুন
3. `database/hotel_management.sql` ফাইলটি import করুন

---

## 🔧 Part 2: Backend Deployment (Railway)

### Step 1: Backend Deploy করুন

1. Railway Dashboard এ **"+ New"** → **"GitHub Repo"** সিলেক্ট করুন
2. আপনার repository সিলেক্ট করুন: `ripro805/LuxNest-Smart-Hotel-Management-Web-App`
3. **Root Directory** সেট করুন: `/backend`

### Step 2: Environment Variables সেট করুন

Railway Dashboard এ **Variables** ট্যাবে গিয়ে এইগুলো add করুন:

```env
DB_HOST=${{MySQL.MYSQLHOST}}
DB_PORT=${{MySQL.MYSQLPORT}}
DB_NAME=${{MySQL.MYSQLDATABASE}}
DB_USER=${{MySQL.MYSQLUSER}}
DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.vercel.app
```

💡 **Important**: 
- Railway তে `${{MySQL.VARIABLE_NAME}}` syntax ব্যবহার করুন database variables এর জন্য
- `FRONTEND_URL` টা পরে update করবেন যখন frontend deploy হবে

### Step 3: Backend URL কপি করুন

1. **Settings** ট্যাবে যান
2. **"Generate Domain"** বাটনে ক্লিক করুন
3. URL কপি করে রাখুন (যেমন: `https://luxnest-backend.up.railway.app`)

### Step 4: Test করুন

Browser এ যান: `https://your-backend-url.railway.app/`

দেখা উচিত: `{"ok": true, "message": "Hotel Management API"}`

---

## 🎨 Part 3: Frontend Deployment (Vercel)

### Step 1: Vercel অ্যাকাউন্ট তৈরি করুন

1. যান: https://vercel.com/
2. GitHub দিয়ে Sign up করুন

### Step 2: Project Import করুন

1. **"Add New..."** → **"Project"** ক্লিক করুন
2. আপনার GitHub repository সিলেক্ট করুন
3. **Root Directory** সেট করুন: `frontend`
4. **Framework Preset**: Vite
5. **Build Command**: `npm run build`
6. **Output Directory**: `dist`

### Step 3: Environment Variables সেট করুন

**Environment Variables** সেকশনে:
```
VITE_API_URL=https://your-backend-url.railway.app/api
```

⚠️ **দরকারি**: আপনার Railway backend URL টা এখানে দিন

### Step 4: Deploy করুন

**"Deploy"** বাটনে ক্লিক করুন। 2-3 মিনিটে deploy হয়ে যাবে!

### Step 5: Frontend URL কপি করুন

Deploy শেষ হলে আপনি একটি URL পাবেন:
```
https://luxnest.vercel.app
```

---

## 🔄 Part 4: Final Configuration

### Railway Backend এ FRONTEND_URL Update করুন

1. Railway Dashboard → Backend project → **Variables**
2. `FRONTEND_URL` variable আপডেট করুন:
   ```
   FRONTEND_URL=https://luxnest.vercel.app
   ```
3. Save করুন (automatically redeploy হবে)

---

## ✅ Testing Your Deployed App

### 1. Backend API Test করুন
```bash
# Health check
curl https://your-backend-url.railway.app/

# Customers API
curl https://your-backend-url.railway.app/api/customers

# Rooms API
curl https://your-backend-url.railway.app/api/rooms
```

### 2. Frontend Test করুন

1. Browser এ আপনার Vercel URL টি open করুন
2. Login করে দেখুন
3. সব features test করুন (Customers, Rooms, Bookings, etc.)

---

## 🛠️ Troubleshooting (সমস্যা সমাধান)

### Database Connection Error

**সমস্যা**: Backend Database এ connect করতে পারছে না

**সমাধান**:
```bash
# Railway Dashboard এ check করুন:
1. MySQL service running আছে কিনা
2. Environment variables সঠিকভাবে সেট আছে কিনা
3. Backend logs দেখুন: Railway Dashboard → Backend → Logs
```

### CORS Error

**সমস্যা**: Frontend থেকে API call করলে CORS error আসে

**সমাধান**:
```bash
1. Railway এ FRONTEND_URL সঠিকভাবে সেট করুন
2. https:// দিয়ে শুরু হয় কিনা check করুন
3. Backend redeploy করুন
```

### API Calls Failing

**সমস্যা**: Frontend থেকে API calls কাজ করছে না

**সমাধান**:
```bash
1. Vercel Dashboard → Project → Settings → Environment Variables
2. VITE_API_URL check করুন
3. /api শেষে আছে কিনা দেখুন
4. Frontend redeploy করুন
```

### Build Failed

**সমস্যা**: Vercel বা Railway তে build fail হচ্ছে

**সমাধান**:
```bash
# Local এ test করুন:
cd frontend
npm install
npm run build

cd ../backend
npm install
npm start
```

---

## 📱 Post-Deployment Steps

### 1. Custom Domain যোগ করুন (Optional)

**Vercel এ:**
1. Project Settings → Domains
2. আপনার domain add করুন

**Railway এ:**
1. Settings → Domains
2. Custom domain add করুন

### 2. Environment Variables Backup

সব environment variables একটা secure জায়গায় save করে রাখুন:
```
# Backend (Railway)
DB_HOST=...
DB_PORT=...
DB_NAME=...
DB_USER=...
DB_PASSWORD=...
FRONTEND_URL=...

# Frontend (Vercel)
VITE_API_URL=...
```

### 3. GitHub Repository Update করুন

```bash
# Local changes push করুন
git add .
git commit -m "Add deployment configurations"
git push origin main
```

Auto-deployment enable থাকলে, GitHub এ push করলেই automatically deploy হবে!

---

## 🎉 Congratulations!

আপনার LuxNest Hotel Management App এখন live! 🚀

### Your Live URLs:
- **Frontend**: `https://luxnest.vercel.app`
- **Backend**: `https://luxnest-backend.up.railway.app`

---

## 📞 Support

কোন সমস্যা হলে:
1. GitHub Issues: https://github.com/ripro805/LuxNest-Smart-Hotel-Management-Web-App/issues
2. Vercel Logs: Vercel Dashboard → Project → Logs
3. Railway Logs: Railway Dashboard → Service → Logs

---

## 🔄 Future Updates

### নতুন features add করার পর:

```bash
# Code update করুন
git add .
git commit -m "Add new feature"
git push origin main
```

**Automatic Deployment** enable থাকলে:
- ✅ Vercel automatically frontend deploy করবে
- ✅ Railway automatically backend deploy করবে

---

## 💰 Free Tier Limits

### Railway:
- ✅ $5 credit free every month
- ✅ 500 hours execution time
- ✅ 1GB database storage

### Vercel:
- ✅ Unlimited deployments
- ✅ 100GB bandwidth per month
- ✅ Unlimited projects

---

**Happy Deploying! 🎊**

Made with ❤️ for LuxNest
