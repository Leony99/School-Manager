import { PrismaClient } from '@prisma/client';
import { clerkClient } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

async function main() {
  const client = await clerkClient();
  await client.users.createUser({
      username: 'admin',
      password: 'admin',
      firstName: 'admin',
      lastName: 'example',
      publicMetadata: { role: "admin" }
  });

  await prisma.grade.createMany({
    data: [
      { level: 1 },
      { level: 2 },
      { level: 3 },
      { level: 4 },
      { level: 5 },
      { level: 6 },
      { level: 7 },
      { level: 8 },
      { level: 9 },
      { level: 10 },
      { level: 11 },
      { level: 12 },
    ],
  });

  await prisma.class.createMany({
    data: [
      { name: "Class 1A", capacity: 30, gradeId: 1 },
      { name: "Class 2A", capacity: 25, gradeId: 2 },
      { name: "Class 3A", capacity: 20, gradeId: 3 },
    ],
  });

  await prisma.subject.createMany({
    data: [
      { name: "Mathematics" },
      { name: "Science" },
      { name: "History" },
    ],
  });

  const classRecords = await prisma.class.findMany();
  const today = new Date();

  await prisma.event.createMany({
    data: [
      {
        title: "Field Trip",
        description: "A fun field trip to the museum.",
        startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 8, 0, 0),
        endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 17, 0, 0),
        classId: classRecords[0].id,
      },
      {
        title: "Science Fair",
        description: "Students will present their science projects.",
        startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7, 8, 0, 0),
        endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7, 12, 0, 0),
      },
      {
        title: "History Debate",
        description: "Students will debate historical topics.",
        startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 11, 10, 0, 0),
        endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 11, 12, 0, 0),
        classId: classRecords[1].id,
      },
    ],
  });

  await prisma.announcement.createMany({
    data: [
      {
        title: "School Closed",
        description: "The school will be closed for a holiday.",
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2),
      },
      {
        title: "Exam Schedule",
        description: "Exams will take place over the next two weeks.",
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3),
      },
      {
        title: "School Event",
        description: "A cultural event will be held soon.",
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 8),
      },
    ],
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
