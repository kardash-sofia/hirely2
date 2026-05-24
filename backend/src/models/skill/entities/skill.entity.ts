import { BaseEntity } from '../../../common/base/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('skills')
export class Skill extends BaseEntity {
  @Column({ unique: true })
  name: string;
}
