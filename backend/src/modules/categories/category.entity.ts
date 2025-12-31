import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, RelationId } from 'typeorm';

@Entity({ name: 'categories' })
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column({ nullable: true })
  banner?: string;

  @Column({ nullable: true })
  shortDesc?: string;

  @Column({ nullable: true })
  slug?: string;

  @Column({ nullable: true })
  icon?: string;

  @Column({ default: 'active' })
  status!: 'active' | 'inactive';

  @Column({ default: 0 })
  position!: number;

  @ManyToOne(() => Category, category => category.children, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'parent_id' })
  parent?: Category | null;

  @RelationId((category: Category) => category.parent)
  parentId?: string | null;

  @OneToMany(() => Category, category => category.parent)
  children?: Category[];
}
