# Quick Setup Guide

## 1. Install Dependencies
```bash
npm install
```

## 2. Create Environment File
Create a `.env.local` file in the root directory with:

```env
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_generated_secret_here
```

## 3. Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set Application Type to "Web application"
6. Add these Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
7. Copy the Client ID and Client Secret

## 4. Generate NextAuth Secret
```bash
openssl rand -base64 32
```

## 5. Run the Application
```bash
npm run dev
```

## 6. Test the Application
- Open http://localhost:3000
- Click "Login with Google"
- Create vendors using the form
- View vendors in the table below

## Troubleshooting

### OAuthSignin Error
- Make sure your Google OAuth credentials are correct
- Verify the redirect URI is exactly: `http://localhost:3000/api/auth/callback/google`
- Check that all environment variables are set correctly

### Module Not Found Errors
- Run `npm install` to install all dependencies
- Make sure you're using the correct package versions from package.json 