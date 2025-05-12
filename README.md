# PopNow - Proof of Participation Token Platform

PopNow is a web application that allows users to easily create and distribute compressed Solana tokens (cTokens) as proof-of-participation for events. The platform leverages Solana's ZK compression technology to provide an efficient and user-friendly way to distribute tokens.
<img width="1508" alt="Screenshot 2025-05-12 at 11 41 42 AM" src="https://github.com/user-attachments/assets/5cd0b089-be17-4737-9705-c7b50d57081e" />


## Features

- Create event-specific cTokens with custom images and supply
- Generate QR codes for easy token claiming
- Distribute compressed tokens (cTokens) to event participants
- Built on Solana blockchain with ZK compression support
- Cloudinary integration for image storage

## Tech Stack

- **Frontend**: Next.js 14 with App Router
- **Styling**: TailwindCSS with NativeWind
- **Blockchain**: Solana Web3.js, SPL Token, Light Protocol (Compressed Tokens)
- **Database**: Prisma with PostgreSQL
- **Animation**: Framer Motion
- **Image Storage**: Cloudinary

## Application Routes

- **/** - Home page with information about the platform
- **/create** - Create new event tokens with custom name, supply, and image
- **/event** - Information page explaining how the platform works
- **/event/[id]** - View specific event details and claim token
- **/event/[id]/claim** - Token claim page for participants

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

The application requires several environment variables to be set:

```
# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Solana
NEXT_PUBLIC_RPC_URL=
NEXT_PUBLIC_ESCROW_ADDRESS=

# Database
DATABASE_URL=
```

## How It Works

1. **Create an Event**: Organizers create a new event with a name, token supply, and custom image
2. **Generate QR Code**: A unique QR code is generated for the event
3. **Share with Participants**: Participants scan the QR code at the event
4. **Claim Tokens**: Participants connect their Solana wallet to claim a compressed token
5. **Proof of Participation**: Participants now have a verifiable proof of attendance on Solana

