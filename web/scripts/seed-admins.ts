// scripts/seed-admins.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const ADMIN_WALLETS = [
  '0xc3DbC713d5dd66CD2f529c6162Cf06dc9fe18b01',
  '0xb7695977d25D95d23b45BD6f9ACB74A5d332D28d'
];

const ADMIN_EMAILS = [
  'chrisliu504638@gmail.com',
  'Junjieja.li2@gmail.com',
  'freddyplati@gmail.com',
  'howdywu@gmail.com',
  'allanustw@gmail.com',
  'clarke.khadeja@gmail.com'
];

async function main() {
  for (const email of ADMIN_EMAILS) {
    await prisma.admin.upsert({
      where: { email },
      update: {},
      create: { email }
    });
  }

  for (const walletAddress of ADMIN_WALLETS) {
    await prisma.admin.upsert({
      where: { walletAddress },
      update: {},
      create: { walletAddress }
    });
  }

  console.log('✅ Admins seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
