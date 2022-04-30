import { Entity, Enum, Property } from '@mikro-orm/core';
import { BaseEntity } from 'src/common/entities';
import { UploadType } from '../interfaces/file-type';

@Entity()
export class File extends BaseEntity {
  @Property()
  path!: string;

  @Property()
  filename!: string;

  @Property()
  size!: number;

  @Enum(() => UploadType)
  type!: UploadType;
}
