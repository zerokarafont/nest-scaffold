import { Entity, Property, Unique } from '@mikro-orm/core';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'src/common/entities';

@Entity()
export class User extends BaseEntity {
  @ApiProperty({ description: '用户名' })
  @Unique()
  @Property()
  username!: string;

  @Property({ hidden: true })
  password!: string;
}
