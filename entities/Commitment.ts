import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

export enum CommitmentOutcome {
  PENDING = 'pending',
  ACHIEVED = 'achieved',
  FAILED = 'failed',
}

@Entity('commitments')
export class Commitment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  code!: string; // Format: YYYYMMDD-HHMMSS

  @Column('text')
  text!: string;

  @Column('decimal', { precision: 5, scale: 2 })
  declaredConfidence!: number; // 0-100

  @Column('datetime')
  deadline!: Date;

  @Column({ default: 'general' })
  category!: string;

  @Column({
    type: 'text',
    default: CommitmentOutcome.PENDING,
  })
  outcome!: CommitmentOutcome;

  @Column('datetime', { nullable: true })
  completedAt?: Date;

  @Column('integer', { nullable: true })
  deltaMinutes?: number; // Minutes difference between deadline and completion

  @Column('text', { nullable: true })
  resolution?: string; // Outcome description

  @Column('text', { nullable: true })
  evidence?: string; // Evidence URL or text

  @Column('text', { nullable: true })
  testimony?: string; // User's testimony

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => require('./User').User, (user: any) => user.commitments)
  @JoinColumn({ name: 'userId' })
  user!: any;

  @Column()
  userId!: string;
}

