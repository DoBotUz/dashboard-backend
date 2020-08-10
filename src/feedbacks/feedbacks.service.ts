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
  
  listAllBots(bot_id: number): Promise<Feedback[]> {
    return this.feedbacksRepository.find({
      where: {
        bot_id
      }
    })
  }

  async findOne(id: number): Promise<Feedback> {
    return this.feedbacksRepository.findOne({
      where: {
        id,
      },
    });
  }

}