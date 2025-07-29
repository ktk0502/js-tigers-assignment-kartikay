# Vendor Management System

A modern web application for managing vendors with Google authentication and PostgreSQL database, built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 🔐 **Google Authentication**: Secure login/logout with Google OAuth
- 📝 **Vendor Creation**: Create vendors with comprehensive form validation
- 📊 **Vendor Management**: View and manage all created vendors
- 🎨 **Modern UI**: Beautiful, responsive design with Tailwind CSS
- ✅ **Form Validation**: Client-side validation using Zod and React Hook Form
- 🗄️ **PostgreSQL Database**: Persistent data storage with proper relationships

## Vendor Form Fields

### Required Fields (*)
- **Vendor Name**: The name of the vendor
- **Bank Account No.**: Vendor's bank account number
- **Bank Name**: Name of the vendor's bank
- **Address Line 2**: Second line of the vendor's address

### Optional Fields
- **Address Line 1**: First line of the vendor's address
- **City**: Vendor's city
- **Country**: Vendor's country
- **Zip Code**: Vendor's postal/zip code

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set up PostgreSQL Database

#### Option A: Using Docker (Recommended)
```bash
# Start PostgreSQL with Docker
docker run --name vendor-db -e POSTGRES_PASSWORD=password -e POSTGRES_DB=vendor_management -p 5432:5432 -d postgres:15
```

#### Option B: Local PostgreSQL Installation
1. Install PostgreSQL on your system
2. Create a database named `vendor_management`
3. Make sure PostgreSQL is running on port 5432

### 3. Set up Google OAuth

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" and create an OAuth 2.0 Client ID
5. Add `http://localhost:3000/api/auth/callback/google` to the authorized redirect URIs
6. Copy your Client ID and Client Secret

### 4. Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here

# PostgreSQL Database Configuration
DB_USER=postgres
DB_HOST=localhost
DB_NAME=vendor_management
DB_PASSWORD=password
DB_PORT=5432
```

### 5. Generate NextAuth Secret

Generate a secure secret for NextAuth:

```bash
openssl rand -base64 32
```

### 6. Set up Database Tables

Run the database setup script:

```bash
npm run setup-db
```

### 7. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Login**: Click "Login with Google" to authenticate
2. **Create Vendor**: Fill out the vendor form with required and optional information
3. **View Vendors**: See all created vendors in the table below the form
4. **Logout**: Click the logout button to sign out

## Database Schema

### Users Table
- `id` (SERIAL PRIMARY KEY)
- `email` (VARCHAR, UNIQUE)
- `name` (VARCHAR)
- `image` (VARCHAR)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Vendors Table
- `id` (SERIAL PRIMARY KEY)
- `vendor_name` (VARCHAR, NOT NULL)
- `bank_account_no` (VARCHAR, NOT NULL)
- `bank_name` (VARCHAR, NOT NULL)
- `address_line_1` (VARCHAR)
- `address_line_2` (VARCHAR, NOT NULL)
- `city` (VARCHAR)
- `country` (VARCHAR)
- `zip_code` (VARCHAR)
- `user_id` (INTEGER, FOREIGN KEY)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js with Google Provider
- **Form Handling**: React Hook Form with Zod validation
- **Database**: PostgreSQL with pg driver
- **UI Components**: Custom components with modern design

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts  # NextAuth API route
│   │   └── vendors/route.ts             # Vendor API endpoints
│   ├── layout.tsx                       # Root layout with providers
│   ├── page.tsx                         # Main dashboard page
│   └── providers.tsx                    # Session provider wrapper
├── components/
│   ├── auth/
│   │   └── LoginButton.tsx              # Authentication component
│   └── vendor/
│       ├── VendorForm.tsx               # Vendor creation form
│       └── VendorList.tsx               # Vendor display table
├── lib/
│   ├── db.ts                           # Database connection
│   ├── vendor-db.ts                    # Database operations
│   └── schema.sql                      # Database schema
└── types/
    ├── vendor.ts                       # TypeScript types and validation
    └── next-auth.d.ts                  # Auth types
```

## Development

- **TypeScript**: Full type safety throughout the application
- **ESLint**: Code linting and formatting
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Error Handling**: Comprehensive error handling and user feedback
- **Database**: PostgreSQL with proper relationships and constraints

## Deployment

This application can be deployed to Vercel, Netlify, or any other Next.js-compatible hosting platform. Make sure to:

1. Set up environment variables in your hosting platform
2. Configure Google OAuth redirect URIs for your production domain
3. Update `NEXTAUTH_URL` to your production URL
4. Set up a PostgreSQL database (e.g., Supabase, Railway, or your own server)
5. Update database connection variables for production

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use this project for your own purposes.
