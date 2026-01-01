import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'features_options' })
export class FeatureOption {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  text!: string;

  @Column({ nullable: true })
  icon?: string | null;

  @Column({ default: 'active' })
  status!: 'active' | 'inactive';
}
