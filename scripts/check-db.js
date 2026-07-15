import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import  path from 'path';

// Load DATABASE_URL from project's .env
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const match = envContent.match(/^DATABASE_URL=["']?([^"'\r\n]+)["']?/m);
  if (match) {
    process.env.DATABASE_URL = match[1];
  }
}

const prisma = new PrismaClient({
  accelerateUrl: process.env.DATABASE_URL,
});

async function main() {
  console.log('=== USERS & REPUTATION ===');
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, reputation: true }
  });
  console.table(users);

  console.log('\n=== QUESTIONS (Upvotes Count and Voter IDs) ===');
  const questions = await prisma.question.findMany({
    where: {
      upvote: { gt: 0 }
    },
    select: {
      title: true,
      upvote: true,
      upvoteUserIds: true
    }
  });
  console.log(questions);

  console.log('\n=== ANSWERS (Upvotes Count and Voter IDs) ===');
  const answers = await prisma.answer.findMany({
    where: {
      upvote: { gt: 0 }
    },
    select: {
      content: true,
      upvote: true,
      upvoteUserIds: true,
      question: { select: { title: true } }
    }
  });
  console.log(answers.map(ans => ({
    question: ans.question.title,
    answerPreview: ans.content.substring(0, 50) + '...',
    upvote: ans.upvote,
    upvoteUserIds: ans.upvoteUserIds
  })));
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
