import { BaseEntity } from '../../../common/base/base.entity';
import { FreelancerProfile } from '../../freelancer-profile/entities/freelancer-profile.entity';
import { Column, Entity, ManyToMany } from 'typeorm';

@Entity('skills')
export class Skill extends BaseEntity {
  @Column({ unique: true })
  name: string;

  @ManyToMany(() => FreelancerProfile, profile => profile.skills)
  freelancerProfiles: FreelancerProfile[];
}
