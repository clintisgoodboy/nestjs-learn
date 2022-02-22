import { HttpException, HttpStatus } from '@nestjs/common';
export class ForbiddenException extends HttpException {
  constructor() {
    console.log('ForbiddenException');

    super('Forbidden', HttpStatus.FORBIDDEN);
  }
}
