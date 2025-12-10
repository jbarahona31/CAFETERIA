# Railway Configuration Guide

This guide explains how to properly configure Railway to deploy the CAFETERIA application.

## ✅ Changes Applied

### 1. Database Schema Updated ✓
- **Usuarios table** now uses `correo` and `contraseña` columns instead of `email` and `contrasena_hash`
- All controllers and services updated to match the database schema
- All seed scripts updated

### 2. Database Connection with SSL ✓
- `database.js` supports Railway's DATABASE_URL with SSL enabled
- Also supports individual connection parameters with SSL via `DB_SSL=true` environment variable
- SSL configuration: `{ rejectUnauthorized: false }` for Railway compatibility

### 3. Package.json Scripts ✓
- `"deploy"` script exists: `"deploy": "npm run init-db && npm start"`
- This runs database initialization before starting the server

### 4. Railway.json Configuration ✓
- Uses `npm run deploy --prefix backend` as start command
- Build command installs dependencies for backend and frontend

## 🛠️ Railway Dashboard Settings

### Important: Root Directory Configuration

**Problem:** Railway might look for `package.json` in `/app/backend/backend/` instead of `/app/backend/`.

**Solution:** In Railway Dashboard:

1. Go to your service → **Settings**
2. Find **Root Directory** setting
3. Set it to: **`backend`** (NOT `backend/backend`)
4. Save changes

### Alternative: Start Command

If you still encounter path issues, you can also use this start command in Railway settings:
```
npm run start --prefix backend
```

Note: The current `npm run deploy --prefix backend` is preferred as it initializes the database.

## 📋 Environment Variables Required

Make sure these environment variables are set in Railway:

### Database (Option 1: DATABASE_URL)
```
DATABASE_URL=postgresql://user:password@host:port/database
```
Railway provides this automatically when you provision a PostgreSQL database.

### Database (Option 2: Individual Variables)
```
DB_HOST=monorail.proxy.rlwy.net
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=railway
DB_SSL=true
NODE_ENV=production
```

### JWT Secret (Required)
```
JWT_SECRET=your_super_secret_jwt_key_here
```

## 🔍 Troubleshooting

### Error: `getaddrinfo ENOTFOUND postgres.railway.internal`

**Cause:** Using internal Railway hostname that's not accessible.

**Solution:** 
- Use the public host (e.g., `monorail.proxy.rlwy.net`) 
- OR use `DATABASE_URL` which Railway provides automatically

### Error: `Missing script: "deploy"`

**Cause:** Railway can't find the package.json or the deploy script.

**Solution:**
- Verify Root Directory is set to `backend` in Railway settings
- The deploy script exists in `backend/package.json`

### Error: `ENOENT Could not read package.json`

**Cause:** Railway is looking in the wrong directory.

**Solution:**
- Set Root Directory to `backend` in Railway Dashboard
- OR use `--prefix backend` in start command

### Error: 500 on `/api/usuarios/register` or `/api/usuarios/login`

**Cause:** Column name mismatch between code and database.

**Solution:**
- This is now fixed! The code uses `correo` and `contraseña` 
- Make sure to run `npm run init-db` or the deploy script to create tables with correct schema
- Or manually update existing table columns if data exists

## 🚀 Deployment Steps

1. **Push changes to GitHub**
   ```bash
   git push origin main
   ```

2. **Configure Railway Dashboard**
   - Set Root Directory to `backend`
   - Verify environment variables are set
   - Ensure PostgreSQL database is provisioned

3. **Deploy**
   - Railway will automatically deploy from GitHub
   - The deploy script will:
     1. Install dependencies
     2. Initialize database schema
     3. Start the server

4. **Verify Deployment**
   - Check Railway logs for successful connection
   - Test the API endpoints
   - Login with default credentials (remember to change them!)

## 📊 Database Schema

The usuarios table now has this structure:
```sql
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  correo VARCHAR(120) UNIQUE NOT NULL,
  contraseña VARCHAR(255) NOT NULL,
  rol VARCHAR(20) DEFAULT 'mesero',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

The productos table structure (unchanged):
```sql
CREATE TABLE productos (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  categoria VARCHAR(20) NOT NULL,
  descripcion TEXT,
  precio NUMERIC(10,2) NOT NULL,
  stock INT DEFAULT 0,
  promocion BOOLEAN DEFAULT FALSE,
  imagen_url TEXT
);
```

## 🔒 Security Notes

After deployment:
1. Change default admin passwords immediately
2. Use strong JWT_SECRET in production
3. Never commit `.env` files to git
4. Rotate credentials regularly

## 📝 Notes

- The application now consistently uses Spanish column names (`correo`, `contraseña`) throughout
- SSL is automatically enabled for Railway connections
- Database initialization runs on every deployment via the deploy script
