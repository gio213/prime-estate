# Prime Estate

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38b2ac?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-green?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

Prime Estate is a modern real estate property listing platform where users can browse, search, and list properties for rent or sale. The platform features advanced search and filtering capabilities, user authentication, property management, image uploads, and secure payment processing.

![Prime Estate](./public/assets/hero.png)

## Project Overview

Prime Estate aims to simplify the real estate search process by providing a user-friendly interface to find and list properties. Key features include:

- Advanced property search with multiple filters (property type, price range, etc.)
- Property listings with detailed information and image galleries
- User authentication and profile management
- Property management dashboard for property owners
- Secure payment processing for property listings
- Responsive design for all devices

## Technologies Used

The project is built using modern web technologies:

- **Frontend**:
  - [Next.js 14](https://nextjs.org/) - React framework with App Router
  - [TypeScript](https://www.typescriptlang.org/) - Type-safe programming
  - [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS framework
  - [Radix UI](https://www.radix-ui.com/) - Unstyled, accessible UI components
  - [shadcn/ui](https://ui.shadcn.com/) - Re-usable components built with Radix UI and Tailwind CSS
  - [Lucide React](https://lucide.dev/) - Beautiful, consistent icons

- **Backend**:
  - [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions) - Server-side data fetching and mutations
  - [Prisma ORM](https://www.prisma.io/) - Database ORM for TypeScript
  - [Zod](https://zod.dev/) - TypeScript-first schema validation
  - [JWT](https://jwt.io/) - Authentication token management

- **Storage & Services**:
  - [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) - File storage for property images
  - [Stripe](https://stripe.com/) - Payment processing
  - [PostgreSQL](https://www.postgresql.org/) - Relational database

## Getting Started

After installation, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

### Key URLs

- `/` - Homepage with featured properties
- `/properties` - Browse all property listings
- `/auth/login` - User login
- `/auth/register` - New user registration
- `/my-profile` - User dashboard (authenticated users only)
- `/my-profile/add-property` - Add a new property listing
- `/my-profile/my-listings` - View and manage your property listings
- `/my-profile/manage-credits` - Purchase and manage listing credits

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font) for optimal typography.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/prime-estate.git
   cd prime-estate
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Configure environment variables:

   Create a `.env` file in the root directory and add the following variables:

   ```env
   # Database Connection
   DATABASE_URL="postgresql://user:password@localhost:5432/prime_estate"

   # Authentication
   JWT_SECRET="your-jwt-secret"

   # File Storage
   BLOB_READ_WRITE_TOKEN="your-vercel-blob-token"

   # Stripe
   STRIPE_SECRET_KEY="your-stripe-secret-key"
   STRIPE_WEBHOOK_SECRET="your-stripe-webhook-secret"
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="your-stripe-publishable-key"
   ```

4. Set up the database:

   ```bash
   npx prisma db push
   ```

5. Seed the database with sample data (optional):

   ```bash
   npm run seed
   ```

## Project Structure

```text
/src
  /actions        # Server actions for data operations
  /app            # Next.js application routes
  /components     # React components
  /context        # React context providers
  /lib            # Utility functions and configurations
  /validation     # Zod validation schemas
/prisma           # Prisma schema and migrations
```

## Features

### Property Listings

- Browse properties with pagination
- Advanced search and filtering
- Detailed property information and images

### User Authentication

- User registration and login
- JWT-based authentication
- Protected routes for authenticated users

### Property Management

- Add new properties with multiple images
- Edit and remove existing properties
- Manage property listings through dashboard

### Payment Processing

- Secure payment handling with Stripe
- Credit system for listing properties

## Deployment

The application is configured for easy deployment on the [Vercel Platform](https://vercel.com/new).

## Screenshots

<details>
<summary>Homepage</summary>

![Homepage](./public/assets/hero.png)
*Homepage with property highlights and search functionality*
</details>

<details>
<summary>Property Listings</summary>

*Property search results with filters*
</details>

<details>
<summary>Property Details</summary>

*Detailed view of a property listing with images and information*
</details>

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/) team for the amazing framework
- [Prisma](https://www.prisma.io/) for the excellent ORM
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Vercel](https://vercel.com/) for hosting and infrastructure
