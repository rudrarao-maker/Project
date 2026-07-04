const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const admins = await prisma.admin.findMany();
  console.log('Admins count:', admins.length);
  if(admins.length > 0) {
      console.log('Sample admin email:', admins[0].email, 'password:', admins[0].password);
  }
  
  const users = await prisma.user.findMany();
  console.log('Users count:', users.length);
  if(users.length > 0) {
      console.log('Sample user email:', users[0].email, 'password:', users[0].password);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
