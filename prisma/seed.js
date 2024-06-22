const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const sections = [
    { name: 'Backlog', order: 1 },
    { name: 'To Do', order: 2 },
    { name: 'In Progress', order: 3 },
    { name: 'Done', order: 4 },
  ];

  for (const section of sections) {
    await prisma.section.upsert({
      where: { name: section.name },
      update: {},
      create: {
        name: section.name,
        order: section.order,
      },
    });
  }
}

main()
  .then(() => {
    console.log('Seed data created successfully');
    return prisma.$disconnect();
  })
  .catch((error) => {
    console.error('Error creating seed data:', error);
    return prisma.$disconnect();
  });
