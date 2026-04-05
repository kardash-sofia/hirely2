import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/base/base.entity';
import { ProjectCategory } from '../../project-category/entities/project-category.entity';
import { ProjectTechnology } from '../../project-technology/entities/project-technology.entity';
import { Task } from '../../task/entities/task.entity';
import { ProjectStatus } from '../constants';
import { User } from '../../user/entities/user.entity';

@Entity('projects')
export class Project extends BaseEntity {
  @Column()
  title: string;

  @Column({ type: 'uuid' })
  ownerId: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'int', nullable: true })
  budgetMin: number;

  @Column({ type: 'int', nullable: true })
  budgetMax: number;

  @Column({ type: 'enum', enum: ProjectStatus, default: ProjectStatus.OPEN })
  status: ProjectStatus;

  @Column({ type: 'date', nullable: true })
  dueDate: Date;

  @Column({ type: 'uuid', nullable: true })
  executorId: string;

  @ManyToOne(() => User, user => user.ownedProjects)
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @ManyToOne(() => User, user => user.executedProjects, { nullable: true })
  @JoinColumn({ name: 'executorId' })
  executor: User;

  @OneToMany(() => Task, task => task.project)
  tasks: Task[];

  @OneToMany(() => ProjectCategory, pc => pc.project)
  projectCategories: ProjectCategory[];

  @OneToMany(() => ProjectTechnology, pt => pt.project)
  projectTechnologies: ProjectTechnology[];
}
