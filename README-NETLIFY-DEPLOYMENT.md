# Netlify Deployment Guide

This guide will help you deploy your Medical Credentialing Compliance System to Netlify.

## Prerequisites

- A Netlify account (free at https://netlify.com)
- Your code pushed to a Git repository (GitHub, GitLab, or Bitbucket)
- A Gemini API key (already configured)

## Deployment Steps

### 1. Connect Your Repository

1. Log in to your Netlify dashboard
2. Click "Add new site" → "Import an existing project"
3. Choose your Git provider and select your repository
4. Netlify will automatically detect the build settings from `netlify.toml`

### 2. Configure Environment Variables

In your Netlify site settings:

1. Go to **Site settings** → **Environment variables**
2. Add the following variable:
   - **Key**: `VITE_GEMINI_API_KEY`
   - **Value**: Your Gemini API key

Note: The `VITE_` prefix is required for environment variables to be accessible in the frontend build.

### 3. Build Settings (Auto-configured)

The `netlify.toml` file already configures:
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Node.js version**: 20

### 4. Deploy

1. Click "Deploy site"
2. Netlify will build and deploy your application
3. You'll get a unique URL like `https://amazing-name-123456.netlify.app`

## Important Notes

- **Client-Side Deployment**: This application now makes direct API calls to Gemini from the browser, eliminating the need for a backend server.
- **CORS Support**: The Gemini API supports cross-origin requests, enabling browser-based calls.
- **API Key Security**: Your Gemini API key is stored securely in Netlify's environment variables and only exposed during the build process.

## Build Troubleshooting

If your build fails with "vite: not found":
1. Ensure your repository includes `package-lock.json`
2. The build command `npm ci && npx vite build` will install dependencies and build the project
3. Check that all dependencies are listed in `package.json`

## Custom Domain (Optional)

To use a custom domain:
1. Go to **Site settings** → **Domain management**
2. Click "Add custom domain"
3. Follow the DNS configuration instructions

## Troubleshooting

- **Build fails**: Check the deploy logs in Netlify dashboard
- **API errors**: Verify your Gemini API key is correctly set in environment variables
- **404 errors**: The `netlify.toml` redirects should handle SPA routing automatically

Your medical credentialing system will be live and accessible worldwide once deployed!