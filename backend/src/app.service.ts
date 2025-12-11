// backend/src/app.service.ts (1-26)
import { Injectable } from '@nestjs/common';
import { DataSource } from "typeorm";

@Injectable()
export class AppService {
  constructor(private dataSource: DataSource) { }

  getHello(): string {
    return 'Hello World!';
  }

  async getDatabaseStatus(): Promise<string> {
    try {
      if (this.dataSource.isInitialized) {
        return 'Database is connected and operational';
      } else {
        await this.dataSource.initialize();
        if (this.dataSource.isInitialized) {
          await this.dataSource.destroy();
          return 'Database is connected and operational';
        } else {
          return 'Failed to connect to the database';
        }
      }
    } catch (error) {
      return `Error: ${error}`;
    }
  }

  async isDatabaseConnected(): Promise<boolean> {
    try {
      // Verificar si la conexión ya está inicializada
      if (this.dataSource.isInitialized) {
        return true;
      }

      // Intentar inicializar la conexión
      await this.dataSource.initialize();
      const isConnected = this.dataSource.isInitialized;

      // Destruir la conexión después de verificar
      if (isConnected) {
        await this.dataSource.destroy();
      }

      return isConnected;
    } catch (error) {
      console.error('Error checking database connection:', error);
      return false;
    }
  }
}