import { Entity, Column, OneToMany, Index } from 'typeorm';
import { ProjectCategory } from '../../project-category/entities/project-category.entity';
import { BaseEntity } from '../../../common/base/base.entity';

@Entity('categories')
export class Category extends BaseEntity {
  @Index({ unique: true })
  @Column()
  name: string;

  @OneToMany(() => ProjectCategory, pc => pc.category)
  projectCategories: ProjectCategory[];
}
