import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const seedData = [
  { amount: 12.5, category: 'food', date: new Date('2026-05-02'), note: 'Lunch meeting' },
  { amount: 58, category: 'transport', date: new Date('2026-05-06'), note: 'Train pass' },
  { amount: 85.2, category: 'utilities', date: new Date('2026-05-10'), note: 'Internet + energy' },
  { amount: 31.9, category: 'entertainment', date: new Date('2026-06-01'), note: 'Team event' },
  { amount: 44.1, category: 'food', date: new Date('2026-06-03'), note: 'Weekly groceries' },
];

async function main() {
  await prisma.expense.deleteMany();
  await prisma.expense.createMany({ data: seedData });
  console.log(`Seeded ${seedData.length} expenses.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
