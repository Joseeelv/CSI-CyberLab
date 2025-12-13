import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Challenge } from './challenge.entity';


@Injectable()
export class ChallengeService {
  constructor(private readonly challengeRepository: Repository<Challenge>) { }

  async getAllChallenges(): Promise<Challenge[]> {
    try {
      return this.challengeRepository.find();
    }
    catch (error) {
      throw new NotFoundException('Challenges not found');
    }
  }
}
