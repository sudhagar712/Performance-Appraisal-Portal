# Vercel Deployment - Image Upload Fix

## Problem
Vercel is a serverless platform where the filesystem is **ephemeral** (temporary). Files uploaded to the server's filesystem are lost when:
- The serverless function restarts
- A new deployment happens
- The function goes to sleep

## Solution
Use **Vercel Blob Storage** for persistent file storage in production, while keeping local file storage for development.

## Setup Instructions

### 1. Install Vercel Blob Package
```bash
cd server
npm install @vercel/blob
```

### 2. Get Vercel Blob Token
1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Storage**
3. Create a new **Blob Store** (or use existing)
4. Copy the **BLOB_READ_WRITE_TOKEN**

### 3. Add Environment Variable
In Vercel Dashboard → Settings → Environment Variables:
- **Key**: `BLOB_READ_WRITE_TOKEN`
- **Value**: Your token from step 2
- **Environment**: Production, Preview, Development

### 4. How It Works

**Production (Vercel):**
- Images uploaded to Vercel Blob Storage
- URLs stored in database: `https://[hash].public.blob.vercel-storage.com/...`
- Images are persistent across deployments

**Local Development:**
- Images saved to `server/uploads/profile/`
- URLs stored: `/uploads/profile/filename.jpg`
- Works normally on your local machine

### 5. Code Changes Made

1. **`server/config/vercelBlob.js`** - Vercel Blob upload/delete functions
2. **`server/middlewares/upload.js`** - Auto-detects Vercel vs local
3. **`server/controllers/authControllers.js`** - Uses Blob in production, local in dev

### 6. Testing

**Local:**
```bash
npm run server
# Upload image - saves to server/uploads/profile/
```

**Production:**
- Deploy to Vercel
- Upload image - saves to Vercel Blob Storage
- Image URL will be from `blob.vercel-storage.com`

## Alternative Solutions

If you don't want to use Vercel Blob, you can use:
1. **Cloudinary** (free tier available)
2. **AWS S3** (pay per use)
3. **Supabase Storage** (free tier available)
4. **Base64 in Database** (not recommended for large files)

## Notes

- The code automatically detects if running on Vercel (`process.env.VERCEL`)
- No code changes needed when switching between local and production
- Images uploaded in production persist across deployments
- Old images are automatically deleted when new ones are uploaded

