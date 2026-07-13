import * as dotenv from 'dotenv';
dotenv.config();

import { prisma } from '../lib/prisma';

async function main() {
  console.log('Updating questions...');
  
  const result = await prisma.question.updateMany({
    data: {
      experienceLevel: 'entry'
    }
  });

  console.log(`Updated ${result.count} questions.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
