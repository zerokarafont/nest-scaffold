import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ abstract: true })
export abstract class BaseEntity {
  @ApiProperty({ description: 'id' })
  @PrimaryKey({ autoincrement: true })
  id!: number;

  @ApiProperty({ description: '创建时间' })
  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  @ApiProperty({ description: '更新时间' })
  @Property({ onUpdate: () => new Date(), hidden: true })
  updatedAt: Date = new Date();

  @ApiProperty({ description: '删除时间' })
  @Property({ nullable: true })
  deletedAt?: Date;
}
