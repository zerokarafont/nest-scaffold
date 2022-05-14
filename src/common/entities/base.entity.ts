import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export abstract class BaseEntity {
  @ApiProperty({ description: 'id' })
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty({ description: '创建时间' })
  @CreateDateColumn()
  createdAt: Date = new Date();

  @ApiProperty({ description: '更新时间' })
  @UpdateDateColumn()
  updatedAt: Date = new Date();

  @ApiProperty({ description: '删除时间' })
  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;
}
