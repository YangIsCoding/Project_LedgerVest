# LedgerVest Database Setup

This document outlines the database structure for the LedgerVest platform, a blockchain-based crowdfunding application. The database serves as a fast, queryable mirror of blockchain data with additional metadata.

## Overview

The LedgerVest database uses PostgreSQL with Prisma as the ORM. It provides:

- Fast access to blockchain data without multiple web3 calls
- Storage for metadata not stored on the blockchain
- Relational data for complex queries
- Real-time syncing with blockchain events

## Database Schema

The database consists of the following models:

1. **User** - Represents both fund seekers and contributors
2. **Campaign** - Project fundraising campaigns
3. **Contribution** - Individual contributions to campaigns
4. **Request** - Fund withdrawal requests
5. **Vote** - Contributor votes on requests
6. **Finalization** - Completed fund withdrawals

## Setup Instructions

### Prerequisites

- PostgreSQL 12 or higher
- Node.js 14 or higher
- Prisma CLI (`npm install -g prisma`)

### Step 1: Install Dependencies

```bash
# Navigate to the project directory
cd ledgervest/web

# Install dependencies
npm install @prisma/client prisma --save-dev
```

### Step 2: Configure Database Connection

Create or update the `.env` file in the web directory:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/ledgervest_db?schema=public"
```

Replace `username` and `password` with your PostgreSQL credentials.

### Step 3: Create the Database

```bash
# Connect to PostgreSQL
psql postgres

# Create the database
CREATE DATABASE ledgervest_db;

# Create the user (if not exists)
CREATE USER youruser WITH PASSWORD 'yourpassword';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE ledgervest_db TO youruser;
```

### Step 4: Apply Migrations

```bash
# Generate Prisma client
npx prisma generate

# Apply migrations
npx prisma migrate dev --name initial_schema
```

## Blockchain Sync Process

The database is kept in sync with the blockchain through event listeners and periodic syncs:

1. When the application starts, it performs a full sync of all campaigns
2. The app subscribes to relevant blockchain events
3. When events occur (new campaigns, contributions, etc.), the database is updated
4. A periodic sync runs to ensure data consistency

## Accessing Database Data

### API Endpoints

The following API endpoints are available:

- `GET /api/campaigns` - List all campaigns
- `GET /api/campaigns/:address` - Get campaign details
- `GET /api/campaigns/:address/requests` - Get campaign fund requests
- `POST /api/contributions` - Record a new contribution
- `POST /api/votes` - Record a new vote
- `POST /api/finalizations` - Record a finalization

### Example Queries

Common database queries using Prisma:

```javascript
// Get all campaigns with their contributions
const campaignsWithContributions = await prisma.campaign.findMany({
  include: {
    contributions: true,
    creator: true
  }
});

// Get user's contributions
const userContributions = await prisma.contribution.findMany({
  where: {
    contributorAddress: userWalletAddress
  },
  include: {
    campaign: true
  }
});

// Get pending requests that need votes
const pendingRequests = await prisma.request.findMany({
  where: {
    is_finalized: false,
    is_approved: false
  },
  include: {
    campaign: true,
    votes: true
  }
});
```

## Maintenance

### Database Backup

Schedule regular backups of your PostgreSQL database:

```bash
pg_dump -U username ledgervest_db > backup_$(date +%Y%m%d).sql
```

### Troubleshooting

If the blockchain sync is out of sync:

1. Check the logs for errors
2. Manually trigger a sync via the admin dashboard
3. Restart the sync service: `npm run sync-restart`

## Schema Migrations

When updating the schema:

1. Update the schema.prisma file
2. Run `npx prisma migrate dev --name your_migration_name`
3. Update any affected API routes and services

## Development Guidelines

1. Always use transactions for related database operations
2. Add appropriate indexes for frequently queried fields
3. Keep blockchain sync logic separate from API business logic
4. Use appropriate error handling for database operations
