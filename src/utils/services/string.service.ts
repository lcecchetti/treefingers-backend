import { Injectable } from '@nestjs/common';

@Injectable()
export class StringService {
  createExcerpt(text = '', limit = 128, suffix = '...') {
    return text.substring(0, text.lastIndexOf(' ', limit)) + suffix;
  }
}
