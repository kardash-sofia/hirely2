import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { Project } from '../../project/entities/project.entity';
import { BaseEntity } from '../../../common/base/base.entity';
import { ApplicationStatus } from '../types';
import { User } from '../../user/entities/user.entity';

@Entity('project_applications')
@Unique(['projectId', 'freelancerId'])
export class ProjectApplication extends BaseEntity {
  @Column({ type: 'uuid' })
  projectId: string;

  @Column({ type: 'uuid' })
  freelancerId: string;

  @Column({ type: 'text', nullable: true })
  coverLetter?: string;

  @Column({ type: 'enum', enum: ApplicationStatus, default: ApplicationStatus.PENDING })
  status: ApplicationStatus;

  @ManyToOne(() => Project, project => project.applications, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'projectId' })
  project: Project;

  @ManyToOne(() => User, user => user.applications, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'freelancerId' })
  freelancer: User;
}
