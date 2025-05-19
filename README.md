# Virtual Tryon Platform

A full-stack application for virtual clothing try-on using 3D avatars, AI-powered size recommendations, and styling advice.

## Project Structure

This project is split into two main parts:

- `frontend/`: React/TypeScript application with React Three Fiber for 3D rendering
- `backend/`: Node.js/Express API with TypeScript

## Deployment to Vercel

### Step 1: Push to GitHub

1. Initialize a Git repository (if not already done):

```bash
git init
git add .
git commit -m "Initial commit"
```

2. Create a new repository on GitHub.

3. Link your local repository to GitHub:

```bash
git remote add origin https://github.com/yourusername/virtualtryon.git
git push -u origin main
```

### Step 2: Deploy Frontend to Vercel

1. Sign up for a Vercel account and connect it to your GitHub account.

2. Create a new project in Vercel and select your GitHub repository.

3. Configure the project:
   - Framework Preset: Create React App
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `build`

4. Add environment variables:
   - `REACT_APP_API_URL`: Your backend API URL (after it's deployed)

5. Deploy the frontend.

### Step 3: Deploy Backend to Vercel

1. Create another new project in Vercel.

2. Configure the project:
   - Framework Preset: Other
   - Root Directory: `backend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
   - Development Command: `npm run dev`

3. Add environment variables (all the ones in your `.env` file):
   - `NODE_ENV`: `production`
   - `RODIN_API_KEY`: Your Rodin AI API key
   - `RODIN_API_ENDPOINT`: Rodin AI endpoint
   - `OPENROUTER_API_KEY`: Your OpenRouter API key
   - `CORS_ORIGIN`: Your frontend Vercel URL (e.g., https://virtualtryon.vercel.app)
   - `API_URL`: Your backend Vercel URL (for OpenRouter header)
   - `UPLOAD_DIR`: `uploads`
   - `MAX_FILE_SIZE`: `10485760`

4. Deploy the backend.

5. After backend deployment, update the frontend's `REACT_APP_API_URL` environment variable to point to your deployed backend URL.

### Step 4: Connect Frontend with Backend

1. In the Vercel dashboard, go to your frontend project's settings.

2. Navigate to Environment Variables.

3. Set `REACT_APP_API_URL` to your backend's production URL + `/api`.
   Example: `https://virtualtryon-backend.vercel.app/api`

4. Redeploy your frontend project.

## Local Development

### Frontend

```bash
cd frontend
npm install
npm start
```

### Backend

```bash
cd backend
npm install
npm run dev
```

## Important Notes for Vercel Deployment

1. **API Keys**: All sensitive API keys should be securely stored as Vercel environment variables, not in your code.

2. **File Storage**: Vercel functions have limited file system access. For production, consider using a cloud storage service like AWS S3 for storing uploads.

3. **Serverless Functions**: The backend is configured to run as serverless functions. Be aware of the cold start times and execution time limits.

4. **Environment Variables**: Remember to set all environment variables in the Vercel dashboard. 