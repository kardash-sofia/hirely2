import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './infrastructure/database/typeorm.config';
import { ProjectsModule } from './models/project/project.module';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), ProjectsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
