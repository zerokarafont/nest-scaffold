import { Entity, Column } from 'typeorm';
import { BaseEntity } from 'src/common/entities';
import { UploadType } from '../interfaces/file-type';

@Entity()
export class File extends BaseEntity {
  @Column()
  path!: string;

  @Column()
  filename!: string;

  @Column()
  size!: number;

  @Column({
    type: 'enum',
    enum: UploadType,
  })
  type!: UploadType;
}
