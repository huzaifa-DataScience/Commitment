import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '@/entities/User';
import { Commitment } from '@/entities/Commitment';

let AppDataSource: DataSource | null = null;

export const getDataSource = async (): Promise<DataSource> => {
  if (AppDataSource && AppDataSource.isInitialized) {
    return AppDataSource;
  }

  AppDataSource = new DataSource({
    type: 'sqlite',
    database: './commitment.db',
    entities: [User, Commitment],
    synchronize: process.env.NODE_ENV !== 'production', // Auto-sync in dev
    logging: process.env.NODE_ENV === 'development',
  });

  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  return AppDataSource;
};

