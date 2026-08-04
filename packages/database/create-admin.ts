import { PrismaClient } from "@prisma/client";
import { hashPassword } from "better-auth/crypto";

const prisma = new PrismaClient();

async function main() {
  console.log("Setting up Admin user...");

  const adminEmail = process.env.ADMIN_EMAIL || "admin@delhincr.fun";
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin123!";

  // 1. Ensure ADMIN role exists
  let adminRole = await prisma.role.findUnique({
    where: { name: "ADMIN" },
  });

  if (!adminRole) {
    adminRole = await prisma.role.create({
      data: {
        name: "ADMIN",
        description: "Full system access",
      },
    });
    console.log("Created ADMIN role");
  }

  // 2. Hash password using Better Auth crypto
  const passwordHash = await hashPassword(adminPassword);

  // 3. Upsert Admin user
  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
      emailVerified: true,
      isVerified: true,
    },
    create: {
      email: adminEmail,
      username: "admin",
      passwordHash,
      emailVerified: true,
      isVerified: true,
    },
  });

  console.log(`Admin user created/updated: ${adminUser.email}`);

  // 4. Ensure Better Auth Credential Account exists with password
  await prisma.account.upsert({
    where: {
      provider_providerAccountId: {
        provider: "credential",
        providerAccountId: adminUser.id,
      },
    },
    update: {
      password: passwordHash,
    },
    create: {
      userId: adminUser.id,
      provider: "credential",
      providerAccountId: adminUser.id,
      password: passwordHash,
    },
  });
  console.log("Created/verified Credential account for Better Auth");

  // 5. Assign ADMIN role
  const existingUserRole = await prisma.userRole.findUnique({
    where: {
      userId_roleId: {
        userId: adminUser.id,
        roleId: adminRole.id,
      },
    },
  });

  if (!existingUserRole) {
    await prisma.userRole.create({
      data: {
        userId: adminUser.id,
        roleId: adminRole.id,
      },
    });
    console.log("Assigned ADMIN role to admin user");
  }

  console.log(`
==================================================
ADMIN CREDENTIALS CREATED & VERIFIED:
Email:    ${adminEmail}
Password: ${adminPassword}
==================================================
  `);
}

main()
  .catch((e) => {
    console.error("Error creating admin user:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
