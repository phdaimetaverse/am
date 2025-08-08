import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('password', 10);
  const [student, instructor, admin] = await Promise.all([
    prisma.user.upsert({
      where: { email: 'student@example.com' },
      update: {},
      create: { email: 'student@example.com', name: 'Student', role: 'student', password: passwordHash },
    }),
    prisma.user.upsert({
      where: { email: 'instructor@example.com' },
      update: {},
      create: { email: 'instructor@example.com', name: 'Instructor', role: 'instructor', password: passwordHash },
    }),
    prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {},
      create: { email: 'admin@example.com', name: 'Admin', role: 'admin', password: passwordHash },
    }),
  ]);

  const course = await prisma.course.create({
    data: {
      title: 'Intro to Metaverse Learning',
      description: 'Demo course',
      tags: ['demo'],
      createdBy: instructor.id,
      modules: {
        create: [
          { type: 'slides', title: 'Lesson Slides', order: 1, textContent: 'Slide 1\nSlide 2' },
          { type: 'whiteboard', title: 'Whiteboard', order: 2 },
        ],
      },
      sessions: {
        create: [{ title: 'Live Session', startAt: new Date(Date.now() + 3600_000) }],
      },
      enrollments: {
        create: [
          { userId: student.id, role: 'student' },
          { userId: instructor.id, role: 'instructor' },
        ],
      },
    },
    include: { sessions: true },
  });

  console.log('Seeded users and course. Session ID:', course.sessions[0].id);
}

main().finally(async () => {
  await prisma.$disconnect();
});

