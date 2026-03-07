import { Entity, JoinColumn, ManyToOne, PrimaryColumn, Unique } from 'typeorm';
import { Category } from '../../category/entities/category.entity';
import { Project } from '../../project/entities/project.entity';

@Entity('project_categories')
@Unique(['projectId', 'categoryId'])
export class ProjectCategory {
  @PrimaryColumn('uuid')
  projectId: string;

  @PrimaryColumn('uuid')
  categoryId: string;

  @ManyToOne(() => Project, p => p.projectCategories, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'projectId' })
  project: Project;

  @ManyToOne(() => Category, c => c.projectCategories, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'categoryId' })
  category: Category;
}
