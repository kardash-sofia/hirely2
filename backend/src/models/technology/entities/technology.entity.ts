import { Entity, Column, OneToMany, Index } from 'typeorm';
import { ProjectTechnology } from '../../project-technology/entities/project-technology.entity';
import { BaseEntity } from '../../../common/base/base.entity';

@Entity('technologies')
export class Technology extends BaseEntity {
  @Index({ unique: true })
  @Column()
  name: string;

  @OneToMany(() => ProjectTechnology, pt => pt.technology)
  projectTechnologies: ProjectTechnology[];
}
