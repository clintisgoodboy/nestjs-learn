import { Injectable } from '@nestjs/common';
// import { Message } from './interfaces/message.interface';
// ORM
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messagesRepository: Repository<Message>
  ) {}

  private readonly messages: Message[] = [];

  async findAll(): Promise<Message[]> {
    return await this.messagesRepository.find();
  }
}
