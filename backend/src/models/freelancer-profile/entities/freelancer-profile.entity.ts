import { Entity, Column, OneToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from '../../../common/base/base.entity';
import { User } from '../../user/entities/user.entity';
import { Category } from '../../category/entities/category.entity';
import { Skill } from '../../skill/entities/skill.entity';
import { Technology } from '../../technology/entities/technology.entity';

@Entity('freelancer_profiles')
export class FreelancerProfile extends BaseEntity {
  @Column({ type: 'uuid' })
  userId: string;

  @OneToOne(() => User, user => user.profile)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: true })
  bio: string;

  @Column({ type: 'decimal', nullable: true })
  hourlyRate: string;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  experienceLevel: string;

  @Column({ default: 0 })
  rating: number;

  @ManyToMany(() => Skill)
  @JoinTable({
    name: 'freelancer_profile_skills',
  })
  skills: Skill[];

  @ManyToMany(() => Category)
  @JoinTable({
    name: 'freelancer_profile_categories',
  })
  categories: Category[];

  @ManyToMany(() => Technology)
  @JoinTable({
    name: 'freelancer_profile_technologies',
  })
  technologies: Technology[];
}
