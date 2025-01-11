import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 2. Criando Grades
  const grades = await prisma.grade.createMany({
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

  // 3. Criando Classes
  const classes = await prisma.class.createMany({
    data: [
      { name: "Class 1A", capacity: 30, gradeId: 1 },
      { name: "Class 2A", capacity: 25, gradeId: 2 },
      { name: "Class 3A", capacity: 20, gradeId: 3 },
    ],
  });

  // 5. Criando Subjects
  const subjects = await prisma.subject.createMany({
    data: [
      { name: "Mathematics" },
      { name: "Science" },
      { name: "History" },
    ],
  });

  // Recuperando os IDs gerados.
  const classRecords = await prisma.class.findMany();

  // 12. Criando Events
  await prisma.event.createMany({
    data: [
      {
        title: "Field Trip",
        description: "A fun field trip to the museum.",
        startTime: new Date("2023-12-05T08:00:00.000Z"),
        endTime: new Date("2023-12-05T17:00:00.000Z"),
        classId: classRecords[0].id,  // Referenciando ID da Class
      },
      {
        title: "Science Fair",
        description: "Students will present their science projects.",
        startTime: new Date("2023-12-15T08:00:00.000Z"),
        endTime: new Date("2023-12-15T15:00:00.000Z"),
      },
      {
        title: "History Debate",
        description: "Students will debate historical topics.",
        startTime: new Date("2023-12-20T10:00:00.000Z"),
        endTime: new Date("2023-12-20T12:00:00.000Z"),
        classId: classRecords[1].id,  // Referenciando ID da Class
      },
    ],
  });

  // 13. Criando Announcements
  await prisma.announcement.createMany({
    data: [
      {
        title: "School Closed",
        description: "The school will be closed on 2023-12-01 for a holiday.",
        date: new Date("2023-12-01T00:00:00.000Z"),
      },
      {
        title: "Exam Schedule",
        description: "Exams will take place from 2023-12-01 to 2023-12-15.",
        date: new Date("2023-12-01T00:00:00.000Z"),
      },
      {
        title: "School Event",
        description: "A cultural event will be held on 2023-12-10.",
        date: new Date("2023-12-10T00:00:00.000Z"),
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
