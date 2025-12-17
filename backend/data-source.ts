import { DataSource } from 'typeorm';
import { User } from './src/users/user.entity';
import { UserLab } from './src/user-lab/user-lab.entity';
import { Lab } from './src/labs/lab.entity';
import { Role } from './src/role/role.entity';
import { Image } from './src/images/image.entity';
import { Status } from './src/status/status.entity';
import { FlagSubmission } from './src/flag-submission/flag-submission.entity';
import { OperatingSystem } from './src/operating-systems/os.entity';
import { Category } from './src/categories/category.entity';
import { Difficulty } from './src/difficulty/difficulty.entity';
import { Container } from './src/containers/container.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  username: process.env.DATABASE_USER || 'user',
  password: process.env.DATABASE_PASSWORD || 'secret',
  database: process.env.DATABASE_NAME || 'postgres-db',
  entities: [
    User,
    UserLab,
    Lab,
    Role,
    Image,
    Status,
    FlagSubmission,
    OperatingSystem,
    Category,
    Difficulty,
    Container,
  ],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
});

export default AppDataSource;
