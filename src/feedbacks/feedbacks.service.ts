import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feedback } from './feedback.entity';

@Injectable()
export class FeedbacksService {
  constructor(
    @InjectRepository(Feedback)
    private feedbacksRepository: Repository<Feedback>,
  ) {}

  async findOne(id: number): Promise<Feedback> {
    return this.feedbacksRepository.findOne({
      where: {
        id,
      },
    });
  }

  async findOneWithBot(id: number): Promise<Feedback> {
    return this.feedbacksRepository.findOne({
      where: {
        id,
      },
      join: {
        alias: 'feedback',
        leftJoinAndSelect: {
          bot: 'feedback.bot',
        }
      }
    });
  }

  async updateOne(id: number, data: any): Promise<Feedback> {
    const feedback = await this.findOne(id);
    Object.assign(feedback, data);
    return await this.feedbacksRepository.save(feedback);
  }
}