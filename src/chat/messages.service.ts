import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { Message } from './message.entity';
import { ParsedBody } from '@nestjsx/crud';
import { FrontendGateway } from 'src/gateways/frontend/frontend.gateway';
import { BotsGateway } from 'src/gateways/bots/bots.gateway';
import { BotUsersCrudService } from 'src/bot-users/bot-users-crud.service';

@Injectable()
export class MessagesService extends TypeOrmCrudService<Message> {
  constructor(
    @InjectRepository(Message)
    public repo: Repository<Message>,
    public frontendGateway: FrontendGateway,
    @Inject(forwardRef(() => BotsGateway))
    public botsGateway: BotsGateway,
    public botUsersService: BotUsersCrudService
  ) {
    super(repo)
  }

  async newMessage(@ParsedBody() body: Message): Promise<Message> {
    const res = await this.repo.insert(body);
    const message = await this.repo.findOne(res.identifiers[0].id);
    return message;
  }

  async notifyAboutMessage(message: Message) {
    this.frontendGateway.handleChatMessage(message);
    this.botsGateway.handleChatMessage(message);
  }

  async getChats(days: number = 14) {
    let from = new Date(new Date().getTime() - 14 * 24 * 3600 * 1000);
    const messages = await this.repo.find({
      where: {
        created_at: {
          $gte: from
        }
      }
    });
    const distinctBotUserIds = messages.reduce((p,c) => {
      if (!c.sent_by_operator)
        p.add(c.author);
      return p;
    }, new Set());
    const botUsers = await this.botUsersService.find({
      where: {
        id: {
          $in: Array.from(distinctBotUserIds)
        }
      }
    });
    const chatsWithLastMessage = botUsers.map(botUser => {
      let lastMessage = messages.filter(msg => msg.author == botUser.id).reduce((p,c) => {
        return p.created_at > c.created_at ? p : c;
      })
      return {
        ...botUser,
        lastMessage: lastMessage
      }
    });

    return chatsWithLastMessage;
  } 
}
