import { Injectable } from '@nestjs/common';

@Injectable()
export class StringService {
  createExcerpt(text = '', limit = 200, suffix = '...') {
    if (text.length < limit) {
      return text;
    }

    return text.substring(0, text.lastIndexOf(' ', limit)) + suffix;
  }
}
