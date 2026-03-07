import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/base/base.entity';
import { Project } from '../../project/entities/project.entity';
import { TaskStatus } from '../constants';

@Entity('tasks')
export class Task extends BaseEntity {
  @Column()
  title: string;

  @ManyToOne(() => Project, project => project.tasks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @Column()
  projectId: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.TODO })
  status: TaskStatus;

  @Column()
  priority: number;

  @Column({ type: 'date', nullable: true })
  dueDate: Date;

  @Column({ default: false })
  aiGenerated: boolean;
}
