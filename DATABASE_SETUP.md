# Railway MySQL Database Setup Guide

## Option 1: Using Railway CLI (সহজ)

### Install Railway CLI
```bash
npm install -g @railway/cli
```

### Login to Railway
```bash
railway login
```

### Link Your Project
```bash
railway link
```

### Connect to MySQL
```bash
railway connect MySQL
```

### Import Database
```sql
# Railway MySQL shell এ:
source database/hotel_management.sql
# অথবা
\. database/hotel_management.sql
```

---

## Option 2: Using MySQL Workbench

### Step 1: Railway থেকে Credentials নিন

Railway Dashboard → MySQL Service → Variables থেকে কপি করুন:
```
Host: xxxx.railway.app
Port: xxxx
Database: railway
Username: root
Password: xxxxxxxxxx
```

### Step 2: MySQL Workbench এ Connection তৈরি করুন

1. MySQL Workbench open করুন
2. **"+"** icon এ ক্লিক করুন (new connection)
3. Details fill করুন:
   - Connection Name: Railway LuxNest
   - Hostname: (Railway থেকে MYSQLHOST)
   - Port: (Railway থেকে MYSQLPORT)
   - Username: root
   - Password: (Store in Keychain/Vault)

### Step 3: Database Import করুন

1. Connection open করুন
2. **Server** → **Data Import**
3. **"Import from Self-Contained File"** select করুন
4. Browse করে `database/hotel_management.sql` select করুন
5. **"Start Import"** ক্লিক করুন

---

## Option 3: Using Railway Dashboard (Alternative)

Railway Dashboard এ direct SQL run করতে পারেন:

1. Railway Dashboard → MySQL Service → **"Data"** tab
2. SQL query box এ paste করুন (ছোট ছোট chunks এ)
3. Execute করুন

⚠️ **Note**: বড় SQL file এর জন্য CLI বা Workbench ব্যবহার করুন

---

## Verify Database Import

Railway MySQL shell বা Workbench এ:

```sql
-- Tables দেখুন
SHOW TABLES;

-- Data check করুন
SELECT * FROM rooms LIMIT 5;
SELECT * FROM customers LIMIT 5;
SELECT * FROM staff LIMIT 5;
SELECT * FROM bookings LIMIT 5;
```

Expected output:
```
+----------------------+
| Tables_in_railway    |
+----------------------+
| bookings             |
| customers            |
| rooms                |
| staff                |
+----------------------+
```

---

## Troubleshooting

### "Access Denied" Error
- Password সঠিক আছে কিনা check করুন
- Railway Variables থেকে সঠিক credentials নিচ্ছেন কিনা verify করুন

### "Can't Connect to MySQL Server"
- Host এবং Port সঠিক আছে কিনা check করুন
- Railway MySQL service running আছে কিনা verify করুন
- Internet connection stable আছে কিনা check করুন

### "Table Already Exists"
```sql
-- আগের tables drop করুন
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS rooms;
DROP TABLE IF EXISTS staff;

-- তারপর আবার import করুন
```
