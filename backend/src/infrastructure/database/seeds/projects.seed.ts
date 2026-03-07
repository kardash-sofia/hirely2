import { NestFactory } from '@nestjs/core';
import { faker } from '@faker-js/faker';

import { AppModule } from '../../../app.module';
import { ProjectService } from '../../../models/project/project.service';

import { CreateProjectDto } from '../../../models/project/dto/create-project.dto';

const PROJECTS_COUNT = 40;

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const projectService = app.get(ProjectService);

  for (let i = 0; i < PROJECTS_COUNT; i++) {
    const dto: CreateProjectDto = {
      title: faker.company.catchPhrase(),
      description: faker.lorem.paragraph(),
      dueDate: faker.date.future({ years: 1 }),

      budgetMin: faker.number.int({ min: 300, max: 2000 }),
      budgetMax: faker.number.int({ min: 2000, max: 8000 }),

      categoryIds: faker.helpers.arrayElements(
        [
          '458822a2-7e46-45df-8ecc-6724dc22f1d8',
          '8e9cbf23-6d6b-4fab-b8a8-93772688864f',
          '4c716b48-f394-42f3-9030-d1102f670c0c',
        ],
        faker.number.int({ min: 1, max: 2 }),
      ),

      technologyIds: faker.helpers.arrayElements(
        [
          '098d10c2-b014-4a3d-b650-2fe4ee453785',
          '817f614c-2fe4-44f9-897c-5e9fd0527b21',
          'bc44edf2-08c0-4a31-84af-fe24162bcfe5',
        ],
        faker.number.int({ min: 1, max: 3 }),
      ),

      tasks: Array.from({ length: faker.number.int({ min: 2, max: 6 }) }).map(() => ({
        title: faker.hacker.phrase(),
        description: faker.lorem.sentences(2),
        priority: faker.number.int({ min: 1, max: 10 }),
        dueDate: faker.date.future({ years: 1 }),
      })),
    };

    await projectService.createProject(dto, faker.string.uuid());
  }

  console.log(`✅ Seeded ${PROJECTS_COUNT} projects using ProjectService`);

  await app.close();
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
