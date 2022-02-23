import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class CustomValitationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    console.log('CustomValitationPipe');

    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      let errorMsg = 'Validation failed';

      for (const key in errors[0].constraints) {
        const element = errors[0].constraints[key];
        errorMsg = element;
      }

      throw new BadRequestException(errorMsg);
    }
    return value;
  }
}
