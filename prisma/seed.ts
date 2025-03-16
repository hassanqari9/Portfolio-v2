import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // Check if admin user already exists
  const adminExists = await prisma.user.findFirst({
    where: {
      email: "admin@example.com",
    },
  });

  if (!adminExists) {
    // Create admin user
    await prisma.user.create({
      data: {
        email: "admin@example.com",
        name: "Admin User",
        password: await hash("password123", 10),
      },
    });
    console.log("Admin user created");
  } else {
    console.log("Admin user already exists");
  }

  // Add sample data if needed
  const aboutExists = await prisma.about.findFirst();
  if (!aboutExists) {
    await prisma.about.create({
      data: {
        title: "Welcome to My Portfolio",
        description: "I'm a passionate developer with expertise in web development and a drive for creating impactful solutions.",
      },
    });
    console.log("Sample about data created");
  }

  const contactExists = await prisma.contact.findFirst();
  if (!contactExists) {
    await prisma.contact.create({
      data: {
        email: "contact@example.com",
        phone: "+1 (555) 123-4567",
        address: "New York, NY",
        linkedin: "https://linkedin.com/in/example",
        github: "https://github.com/example",
      },
    });
    console.log("Sample contact data created");
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  }); 