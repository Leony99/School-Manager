import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 1. Criando Admins
  await prisma.admin.createMany({
    data: [
      { username: "admin1", password: "admin1" },
      { username: "admin2", password: "admin2" },
    ],
  });

  // 2. Criando Grades
  const grades = await prisma.grade.createMany({
    data: [
      { level: 1 },
      { level: 2 },
      { level: 3 },
    ],
  });

  // 3. Criando Classes
  const classes = await prisma.class.createMany({
    data: [
      { name: "Class A", capacity: 30, gradeId: 1 },
      { name: "Class B", capacity: 25, gradeId: 2 },
      { name: "Class C", capacity: 20, gradeId: 3 },
    ],
  });

  // 4. Criando Teachers
  const teachers = await prisma.teacher.createMany({
    data: [
      {
        username: "teacher1",
        name: "John",
        surname: "Doe",
        email: "john.doe@example.com",
        address: "123 Street",
        phone: "123456789",
        bloodType: "O+",
        sex: "male",
        birthday: new Date("1980-01-01"),
      },
      {
        username: "teacher2",
        name: "Jane",
        surname: "Smith",
        email: "jane.smith@example.com",
        address: "456 Avenue",
        phone: "987654321",
        bloodType: "A-",
        sex: "female",
        birthday: new Date("1985-02-01"),
      },
      {
        username: "teacher3",
        name: "Alice",
        surname: "Johnson",
        email: "alice.johnson@example.com",
        address: "789 Road",
        phone: "123123123",
        bloodType: "B+",
        sex: "female",
        birthday: new Date("1990-03-01"),
      },
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

  // 6. Criando Parents
  const parents = await prisma.parent.createMany({
    data: [
      {
        username: "parent1",
        name: "Robert",
        surname: "Brown",
        email: "robert.brown@example.com",
        address: "101 Main St",
        phone: "555123456",
      },
      {
        username: "parent2",
        name: "Laura",
        surname: "Davis",
        email: "laura.davis@example.com",
        address: "202 Main St",
        phone: "555654321",
      },
      {
        username: "parent3",
        name: "Karen",
        surname: "Wilson",
        email: "karen.wilson@example.com",
        address: "303 Main St",
        phone: "555987654",
      },
    ],
  });

  // Recuperando os IDs gerados para Parents, Classes, Subjects, etc.
  const parentRecords = await prisma.parent.findMany();
  const classRecords = await prisma.class.findMany();
  const teacherRecords = await prisma.teacher.findMany();
  const subjectRecords = await prisma.subject.findMany();
  const gradeRecords = await prisma.grade.findMany();

  // 7. Criando Students e conectando com o parentId correto
  await prisma.student.createMany({
    data: [
      {
        username: "student1",
        name: "Michael",
        surname: "Brown",
        email: "michael.brown@example.com",
        address: "101 Main St",
        phone: "555123456",
        bloodType: "AB+",
        sex: "male",
        birthday: new Date("2005-04-01"),
        parentId: parentRecords[0].id, // Referenciando UUID do Parent
        classId: classRecords[0].id,  // Referenciando ID da Class
        gradeId: gradeRecords[0].id,  // Referenciando Grade
      },
      {
        username: "student2",
        name: "Emily",
        surname: "Davis",
        email: "emily.davis@example.com",
        address: "202 Main St",
        phone: "555654321",
        bloodType: "O-",
        sex: "female",
        birthday: new Date("2006-05-01"),
        parentId: parentRecords[1].id, // Referenciando UUID do Parent
        classId: classRecords[1].id,  // Referenciando ID da Class
        gradeId: gradeRecords[1].id,  // Referenciando Grade
      },
      {
        username: "student3",
        name: "Chris",
        surname: "Wilson",
        email: "chris.wilson@example.com",
        address: "303 Main St",
        phone: "555987654",
        bloodType: "A+",
        sex: "male",
        birthday: new Date("2007-06-01"),
        parentId: parentRecords[2].id, // Referenciando UUID do Parent
        classId: classRecords[2].id,  // Referenciando ID da Class
        gradeId: gradeRecords[2].id,  // Referenciando Grade
      },
    ],
  });

  const studentRecords = await prisma.student.findMany();

  // 8. Criando Lessons e conectando corretamente os IDs de Subject, Teacher, e Class
  await prisma.lesson.createMany({
    data: [
      {
        name: "Math - Class A",
        day: "MONDAY",
        startTime: new Date("2023-11-29T08:00:00.000Z"),
        endTime: new Date("2023-11-29T09:00:00.000Z"),
        subjectId: subjectRecords[0].id,  // Referenciando ID do Subject
        classId: classRecords[0].id,     // Referenciando ID da Class
        teacherId: teacherRecords[0].id, // Referenciando ID do Teacher
      },
      {
        name: "Science - Class B",
        day: "TUESDAY",
        startTime: new Date("2023-11-29T09:00:00.000Z"),
        endTime: new Date("2023-11-29T10:00:00.000Z"),
        subjectId: subjectRecords[1].id,  // Referenciando ID do Subject
        classId: classRecords[1].id,     // Referenciando ID da Class
        teacherId: teacherRecords[1].id, // Referenciando ID do Teacher
      },
      {
        name: "History - Class C",
        day: "WEDNESDAY",
        startTime: new Date("2023-11-29T10:00:00.000Z"),
        endTime: new Date("2023-11-29T11:00:00.000Z"),
        subjectId: subjectRecords[2].id,  // Referenciando ID do Subject
        classId: classRecords[2].id,     // Referenciando ID da Class
        teacherId: teacherRecords[2].id, // Referenciando ID do Teacher
      },
    ],
  });

  // 9. Criando Assignments e conectando corretamente os IDs de Subject, Teacher e Class
  await prisma.assignment.createMany({
    data: [
      {
        title: "Math Homework",
        startDate: new Date("2023-11-01"),
        dueDate: new Date("2023-11-15"),
        subjectId: subjectRecords[0].id,  // Referenciando ID do Subject
        classId: classRecords[0].id,     // Referenciando ID da Class
        teacherId: teacherRecords[0].id, // Referenciando ID do Teacher
      },
      {
        title: "Science Project",
        startDate: new Date("2023-11-05"),
        dueDate: new Date("2023-11-20"),
        subjectId: subjectRecords[1].id,  // Referenciando ID do Subject
        classId: classRecords[1].id,     // Referenciando ID da Class
        teacherId: teacherRecords[1].id, // Referenciando ID do Teacher
      },
      {
        title: "History Essay",
        startDate: new Date("2023-11-10"),
        dueDate: new Date("2023-11-25"),
        subjectId: subjectRecords[2].id,  // Referenciando ID do Subject
        classId: classRecords[2].id,     // Referenciando ID da Class
        teacherId: teacherRecords[2].id, // Referenciando ID do Teacher
      },
    ],
  });

  // 10. Criando Exams
  await prisma.exam.createMany({
    data: [
      {
        title: "Math Final Exam",
        startTime: new Date("2023-12-01T08:00:00.000Z"),
        endTime: new Date("2023-12-01T10:00:00.000Z"),
        subjectId: subjectRecords[0].id,  // Referenciando ID do Subject
        classId: classRecords[0].id,     // Referenciando ID da Class
        teacherId: teacherRecords[0].id, // Referenciando ID do Teacher
      },
      {
        title: "Science Midterm",
        startTime: new Date("2023-12-05T09:00:00.000Z"),
        endTime: new Date("2023-12-05T11:00:00.000Z"),
        subjectId: subjectRecords[1].id,  // Referenciando ID do Subject
        classId: classRecords[1].id,     // Referenciando ID da Class
        teacherId: teacherRecords[1].id, // Referenciando ID do Teacher
      },
      {
        title: "History Quiz",
        startTime: new Date("2023-12-10T10:00:00.000Z"),
        endTime: new Date("2023-12-10T11:00:00.000Z"),
        subjectId: subjectRecords[2].id,  // Referenciando ID do Subject
        classId: classRecords[2].id,     // Referenciando ID da Class
        teacherId: teacherRecords[2].id, // Referenciando ID do Teacher
      },
    ],
  });

  // 11. Criando Results
  await prisma.result.createMany({
    data: [
      { score: 90, assignmentId: 1, studentId: studentRecords[0].id }, // Ajuste o ID correto
      { score: 85, assignmentId: 1, studentId: studentRecords[1].id }, // Ajuste o ID correto
      { score: 80, assignmentId: 1, studentId: studentRecords[2].id }, // Ajuste o ID correto
    ],
  });

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
