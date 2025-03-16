import { compare, hash } from "bcrypt";
import { prisma } from "./db";

export async function createUser(email: string, password: string, name: string) {
  const hashedPassword = await hash(password, 10);
  
  return prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  });
}

export async function ensureAdminExists() {
  try {
    // Check if any user exists
    const userCount = await prisma.user.count();
    
    if (userCount === 0) {
      // Create default admin user if no users exist
      await createUser(
        "admin@portfolio.com",
        "Admin123!",
        "Admin User"
      );
      console.log("Created default admin user: admin@portfolio.com / Admin123!");
    }
  } catch (error) {
    console.error("Error ensuring admin exists:", error);
  }
}

export async function verifyCredentials(email: string, password: string) {
  // Ensure admin exists on every login attempt
  await ensureAdminExists();
  
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return null;
  }

  const isValid = await compare(password, user.password);

  if (!isValid) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
  };
} 