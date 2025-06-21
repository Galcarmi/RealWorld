import { lengthValidation } from '../../../src/utils';

describe('Username Validation', () => {
  const usernameValidator = lengthValidation(3, 20);

  describe('Valid Usernames', () => {
    it('accepts usernames of correct length', () => {
      const validUsernames = [
        'abc',
        'testuser',
        'user123',
        'long_username_test',
        'a'.repeat(20),
      ];

      validUsernames.forEach(username => {
        expect(usernameValidator(username)).toBe(true);
      });
    });
  });

  describe('Invalid Usernames', () => {
    it('rejects usernames that are too short', () => {
      const shortUsernames = ['', 'a', 'ab'];

      shortUsernames.forEach(username => {
        expect(usernameValidator(username)).toBe(false);
      });
    });

    it('rejects usernames that are too long', () => {
      const longUsernames = ['a'.repeat(21), 'a'.repeat(50)];

      longUsernames.forEach(username => {
        expect(usernameValidator(username)).toBe(false);
      });
    });

    it('handles undefined and null inputs', () => {
      expect(usernameValidator(undefined)).toBe(false);
      expect(usernameValidator(null as unknown as string)).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('handles exact boundary lengths', () => {
      expect(usernameValidator('a'.repeat(3))).toBe(true);
      expect(usernameValidator('a'.repeat(20))).toBe(true);
      expect(usernameValidator('a'.repeat(2))).toBe(false);
      expect(usernameValidator('a'.repeat(21))).toBe(false);
    });

    it('handles special characters', () => {
      expect(usernameValidator('user_123')).toBe(true);
      expect(usernameValidator('user-name')).toBe(true);
      expect(usernameValidator('user.name')).toBe(true);
    });
  });
});
