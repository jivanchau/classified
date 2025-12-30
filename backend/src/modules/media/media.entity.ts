import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'media' })
export class Media {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column()
  fileName!: string;

  @Column()
  filePath!: string;

  @Column()
  url!: string;

  @Column({ nullable: true })
  mimeType?: string;

  @Column({ type: 'int', default: 0 })
  size?: number;

  @CreateDateColumn()
  createdAt!: Date;
}
