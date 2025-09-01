# 🚀 MVP Deployment Guide

## Overview
- **Backend**: Render (Node.js API)
- **Frontend**: Vercel (React SPA)
- **Database**: Google Sheets API

## 📋 Deployment Steps

### 1. Backend Deployment (Render)

1. **Push code to GitHub**
   ```bash
   git checkout -b mvp-deploy
   git add .
   git commit -m "feat: add MVP deployment configuration"
   git push origin mvp-deploy
   ```

2. **Connect to Render**
   - Go to [render.com](https://render.com)
   - Connect GitHub repository
   - Select `mvp-deploy` branch
   - Use `render.yaml` configuration

3. **Set Environment Variables in Render**
   ```
   SPREADSHEET_ID=your_actual_spreadsheet_id
   GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
   FRONTEND_URL=https://your-vercel-app.vercel.app
   ```

4. **Get Render API URL**
   - Copy your Render app URL (e.g., `https://walksena-api.onrender.com`)

### 2. Frontend Deployment (Vercel)

1. **Update Frontend API URL**
   - Edit `/.env.production`
   - Set `REACT_APP_API_BASE=https://your-render-app.onrender.com`

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Connect GitHub repository  
   - Select `walk-in-form` directory as root
   - Select `mvp-deploy` branch
   - Set environment variable: `REACT_APP_API_BASE`

3. **Configure Build Settings**
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Root Directory: `walk-in-form`

### 3. Final Configuration

1. **Update CORS in Backend**
   - Add your Vercel URL to CORS settings
   - Update `FRONTEND_URL` environment variable in Render

2. **Test the Application**
   - Test API endpoints: `https://your-render-app.onrender.com/api/health`
   - Test frontend: `https://your-vercel-app.vercel.app`

## 🔧 Environment Variables

### Render (Backend)
```
NODE_ENV=production
SERVE_FRONTEND=false
SPREADSHEET_ID=your_spreadsheet_id
GOOGLE_SERVICE_ACCOUNT_KEY=your_service_account_json
FRONTEND_URL=https://your-vercel-app.vercel.app
```

### Vercel (Frontend)
```
REACT_APP_API_BASE=https://your-render-app.onrender.com
REACT_APP_SHOW_CREATE_BUTTON=true
REACT_APP_SHOW_FORM_ACTIONS=true
```

## 📱 Features Included in MVP

✅ **Core Features:**
- Walk-in form with 5 steps
- Customer data management
- Google Sheets integration
- List view with search functionality
- Edit/view customer records
- AI summary modal
- Responsive design (mobile/tablet/desktop)

✅ **MVP Configuration:**
- Create button enabled
- Form actions enabled
- Production optimized build

## 🔄 Auto-Deploy Setup

Both platforms support auto-deploy from GitHub:
- **Render**: Auto-deploys on push to `mvp-deploy` branch
- **Vercel**: Auto-deploys on push to `mvp-deploy` branch

## 🌐 URLs Structure

- **API Base**: `https://your-render-app.onrender.com/api`
- **Frontend**: `https://your-vercel-app.vercel.app`
- **Health Check**: `https://your-render-app.onrender.com/api/health`

## 📞 Support

For deployment issues, check:
1. Render logs for backend issues
2. Vercel function logs for frontend issues  
3. Google Sheets API permissions
4. CORS configuration