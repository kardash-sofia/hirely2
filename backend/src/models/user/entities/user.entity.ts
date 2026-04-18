import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from '../../../common/base/base.entity';
import { Roles } from '../constants';
import { AuthUser } from '../../auth/entities/auth.entity';
import { Project } from '../../project/entities/project.entity';
import { FreelancerProfile } from '../../freelancer-profile/entities/freelancer-profile.entity';
import { ProjectApplication } from '../../project-application/entities/project-application.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ type: 'uuid' })
  authUserId: string;

  @Column({ nullable: true })
  fullName: string;

  @Column({ nullable: true })
  avatar_url: string;

  @Column({ type: 'enum', enum: Roles, nullable: true })
  role: Roles;

  @OneToOne(() => AuthUser, authUser => authUser.user)
  @JoinColumn({ name: 'authUserId' })
  authUser: AuthUser;

  @OneToOne(() => FreelancerProfile, profile => profile.user)
  profile?: FreelancerProfile;

  @OneToMany(() => Project, project => project.owner)
  ownedProjects: Project[];

  @OneToMany(() => Project, project => project.executor)
  executedProjects: Project[];

  @OneToMany(() => ProjectApplication, application => application.freelancer)
  applications: ProjectApplication[];
}
