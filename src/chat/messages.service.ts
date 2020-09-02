import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial, MoreThan, In, Like } from 'typeorm';
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { Message } from './message.entity';
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

  async newMessage(body: Message): Promise<Message> {
    const res = await this.repo.insert(body);
    const message = await this.repo.findOne(res.identifiers[0].id);
    this.notifyAboutMessage(message);
    return message;
  }

  async notifyAboutMessage(message: Message) {
    this.frontendGateway.handleChatMessage(message);
    this.botsGateway.handleChatMessage(message);
  }

  async getChats(organizationId, days: number = 14) {
    let from = new Date(new Date().getTime() - 14 * 24 * 3600 * 1000);
    const messages = await this.repo.find({
      where: {
        created_at: MoreThan(from),
        organizationId
      },
      order: {
        created_at: 'DESC',
      },
    });
    if (messages.length == 0) {
      return [];
    }
    const distinctBotUserIds = messages.reduce((p,c) => {
      if (!c.sent_by_operator) {
        p.add(c.author);
      }
      else {
        p.add(c.recipient);
      }
      return p;
    }, new Set());
    const botUsers = await this.botUsersService.find({
      where: {
        id: In(Array.from(distinctBotUserIds))
      }
    });
    const chatsWithLastMessage = botUsers.map(botUser => {
      let unreadCount = 0;
      let lastMessage = messages.filter(msg => msg.author == botUser.id || msg.recipient == botUser.id).reduce((p,c) => {
        if (!c.is_read) {
          unreadCount++;
        }
        return p.created_at > c.created_at ? p : c;
      })
      return {
        ...botUser,
        lastMessage: lastMessage,
        unreadCount,
      }
    });

    return chatsWithLastMessage;
  }

  async getChatLog(organizationId: number, botUserId: number): Promise<Message[]> {
    return this.repo.find({
      where: [
        { author: botUserId, organizationId },
        { recipient: botUserId, organizationId },
      ]
    });
  }

  async search(query) {
    return this.botUsersService.find({
      where: [
        { username: Like(`%${query}%`) },
        { bio: Like(`%${query}%`) },
        { phone_number: Like(`%${query}%`) },
      ]
    })
  }
}
