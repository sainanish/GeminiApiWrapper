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
   - **Key**: `GEMINI_API_KEY`
   - **Value**: Your Gemini API key

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

- **API Routes**: This application uses client-side only deployment. The Gemini AI calls are made directly from the browser.
- **CORS**: The Gemini API supports CORS, so browser requests work fine.
- **Security**: Your API key is securely stored in Netlify's environment variables.

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