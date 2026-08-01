import { UrlService } from './url.service';
import { Story } from '../../story/story.entity';
import { User } from '../../user/user.entity';
import { Forest } from '../../forest/forest.entity';

describe('UrlService', () => {
  let service: UrlService;

  beforeEach(() => {
    service = new UrlService();
  });

  describe('encodeId / decodeId', () => {
    it('round-trips an id through encode then decode', () => {
      const encoded = service.encodeId(42);
      expect(typeof encoded).toBe('string');
      expect(service.decodeId(encoded)).toBe(42);
    });

    it('produces different encodings for different ids', () => {
      expect(service.encodeId(1)).not.toBe(service.encodeId(2));
    });

    it('decodeId returns NaN for a falsy value', () => {
      expect(service.decodeId('')).toBeNaN();
    });
  });

  describe('URL builders', () => {
    it('getStoryNewUrl returns the static new-story path', () => {
      expect(service.getStoryNewUrl()).toBe('/story/new');
    });

    it('getStoryUrl encodes the story id', () => {
      const story = { id: 7 } as Story;
      expect(service.getStoryUrl(story)).toBe(`/story/${service.encodeId(7)}`);
    });

    it('getUserUrl uses the username', () => {
      const user = { username: 'ada' } as User;
      expect(service.getUserUrl(user)).toBe('/user/ada');
    });

    it('getForestUrl uses the forest name', () => {
      const forest = { name: 'redwoods' } as Forest;
      expect(service.getForestUrl(forest)).toBe('/forest/redwoods');
    });
  });
});
