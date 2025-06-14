import { emailValidation } from '../../../src/utils';

describe('emailValidation', () => {
  it('should return true for valid email addresses', () => {
    const validEmails = [
      'test@example.com',
      'user.name@domain.co.uk',
      'user+tag@example.org',
      'user123@test-domain.com',
      'a@b.co',
    ];

    validEmails.forEach(email => {
      expect(emailValidation(email)).toBe(true);
    });
  });

  it('should return false for invalid email addresses', () => {
    const invalidEmails = [
      '',
      'invalid',
      '@example.com',
      'user@',
      'user@@example.com',
      'user@.com',
      'user@example.',
      'user name@example.com',
      'user@ex ample.com',
    ];

    invalidEmails.forEach(email => {
      expect(emailValidation(email)).toBe(false);
    });
  });

  it('should return false for undefined input', () => {
    expect(emailValidation(undefined)).toBe(false);
  });

  it('should return false for null input', () => {
    expect(emailValidation(null as unknown as string)).toBe(false);
  });
});
