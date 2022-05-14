import { Entity, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'src/common/entities';

@Entity()
export class User extends BaseEntity {
  @ApiProperty({ description: '用户名' })
  @Column({ unique: true })
  username!: string;

  @Column({ select: false })
  password!: string;
}
