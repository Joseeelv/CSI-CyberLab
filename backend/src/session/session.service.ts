import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Session } from './session.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
  ) {}

  async getAllSessions(): Promise<Session[]> {
    try {
      return await this.sessionRepository.find({
        relations: ['user'],
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to retrieve sessions: ${error.message}`,
      );
    }
  }

  async getSessionByToken(token: string): Promise<Session | null> {
    try {
      return await this.sessionRepository.findOne({
        where: { token },
        relations: ['user'],
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to retrieve session: ${error.message}`,
      );
    }
  }


  async getSessionsByUserId(userId: number): Promise<Session[]> {
    try {
      return await this.sessionRepository.find({
        where: { user: { id: userId } },
        relations: ['user'],
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to retrieve user sessions: ${error.message}`,
      );
    }
  }


  async createSession(
    sessionData: Partial<Session>,
    deleteOldSessions: boolean = false,
  ): Promise<Session> {
    if (!sessionData.user) {
      throw new BadRequestException('User is required to create a session');
    }

    if (!sessionData.token) {
      throw new BadRequestException('Token is required to create a session');
    }

    try {
      // Opcional: Eliminar sesiones antiguas del usuario
      if (deleteOldSessions && sessionData.user.id) {
        await this.deleteSessionsByUserId(sessionData.user.id);
      }

      const session = this.sessionRepository.create(sessionData);
      return await this.sessionRepository.save(session);
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to create session: ${error.message}`,
      );
    }
  }


  async deleteSession(userId: number): Promise<{ message: string }> {
    const session = await this.sessionRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    try {
      await this.sessionRepository.remove(session);
      return {
        message: `Session deleted successfully for user ID: ${userId}`,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to delete session: ${error.message}`,
      );
    }
  }

  async deleteSessionByToken(token: string): Promise<{ message: string }> {
    const session = await this.sessionRepository.findOne({
      where: { token },
      relations: ['user'],
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    try {
      await this.sessionRepository.remove(session);
      return {
        message: `Session deleted successfully`,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to delete session: ${error.message}`,
      );
    }
  }

  async deleteSessionsByUserId(userId: number): Promise<{ message: string }> {
    try {
      const sessions = await this.sessionRepository.find({
        where: { user: { id: userId } },
      });

      if (sessions.length === 0) {
        return {
          message: `No sessions found for user ID: ${userId}`,
        };
      }

      await this.sessionRepository.remove(sessions);
      return {
        message: `${sessions.length} session(s) deleted successfully for user ID: ${userId}`,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to delete sessions: ${error.message}`,
      );
    }
  }

  async deleteExpiredSessions(expirationHours: number = 24): Promise<{ message: string }> {
    try {
      const expirationDate = new Date();
      expirationDate.setHours(expirationDate.getHours() - expirationHours);

      const expiredSessions = await this.sessionRepository
        .createQueryBuilder('session')
        .where('session.startTime < :expirationDate', { expirationDate })
        .getMany();

      if (expiredSessions.length === 0) {
        return { message: 'No expired sessions found' };
      }

      await this.sessionRepository.remove(expiredSessions);
      return {
        message: `${expiredSessions.length} expired session(s) deleted successfully`,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to delete expired sessions: ${error.message}`,
      );
    }
  }
}