import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { Message } from './message.entity';
import { ParsedBody } from '@nestjsx/crud';
import { FrontendGateway } from 'src/gateways/frontend/frontend.gateway';
import { BotsGateway } from 'src/gateways/bots/bots.gateway';

@Injectable()
export class MessagesService extends TypeOrmCrudService<Message> {
  constructor(
    @InjectRepository(Message)
    public repo: Repository<Message>,
    public frontendGateway: FrontendGateway,
    public botsGateway: BotsGateway,
  ) {
    super(repo)
  }

  async newMessage(@ParsedBody() body: Message): Promise<Message> {
    const res = await this.repo.createQueryBuilder()
      .insert()
      .values(body)
      .returning('*')
      .execute();
    const message = await this.repo.create(res.generatedMaps[0] as DeepPartial<Message>);
    return message;
  }

  async notifyAboutMessage(message: Message) {
    this.frontendGateway.handleChatMessage(message);
    this.botsGateway.handleChatMessage(message);
  }
}
