import { Controller, Post } from '@nestjs/common';
import { Message } from './entities/message.entity';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  findAll(): Promise<Message[]> {
    return this.messagesService.findAll();
  }
}
