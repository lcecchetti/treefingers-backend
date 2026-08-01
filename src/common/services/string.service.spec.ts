import { StringService } from './string.service';

describe('StringService', () => {
  let service: StringService;

  beforeEach(() => {
    service = new StringService();
  });

  describe('createExcerpt', () => {
    it('returns the text unchanged when shorter than the limit', () => {
      expect(service.createExcerpt('hello world', 200)).toBe('hello world');
    });

    it('defaults to an empty string when no text is given', () => {
      expect(service.createExcerpt()).toBe('');
    });

    it('truncates at the last space before the limit and appends the suffix', () => {
      const text = 'one two three four five';
      // limit=10 -> substring(0, 10) is "one two th", lastIndexOf(' ', 10) is 8
      expect(service.createExcerpt(text, 10)).toBe('one two...');
    });

    it('uses a custom suffix when provided', () => {
      const text = 'one two three four five';
      expect(service.createExcerpt(text, 10, '---')).toBe('one two---');
    });

    it('treats text exactly at the limit as too long (length < limit is strict)', () => {
      const text = 'x'.repeat(10);
      // no space to break on, so lastIndexOf(' ', limit) is -1 and the
      // excerpt collapses to just the suffix - documenting current behavior
      expect(service.createExcerpt(text, 10)).toBe('...');
    });

    it('collapses to the bare suffix when there is no space to break on before the limit', () => {
      expect(service.createExcerpt('nospaceshereatall', 10)).toBe('...');
    });
  });
});
