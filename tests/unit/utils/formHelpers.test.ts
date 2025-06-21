import { emailValidation, lengthValidation } from '../../../src/utils';

describe('Form Validation Helpers', () => {
  describe('Email Validation', () => {
    it('validates correct email formats', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'user+tag@example.org',
      ];

      validEmails.forEach(email => {
        expect(emailValidation(email)).toBe(true);
      });
    });

    it('rejects invalid email formats', () => {
      const invalidEmails = [
        'invalid',
        '@example.com',
        'user@',
        'user@@example.com',
      ];

      invalidEmails.forEach(email => {
        expect(emailValidation(email)).toBe(false);
      });
    });
  });

  describe('Password Length Validation', () => {
    const passwordValidator = lengthValidation(6, 30);

    it('validates passwords of correct length', () => {
      expect(passwordValidator('password123')).toBe(true);
      expect(passwordValidator('123456')).toBe(true);
    });

    it('rejects passwords that are too short', () => {
      expect(passwordValidator('12345')).toBe(false);
      expect(passwordValidator('')).toBe(false);
    });

    it('rejects passwords that are too long', () => {
      expect(passwordValidator('a'.repeat(31))).toBe(false);
    });
  });

  describe('Form Field Combinations', () => {
    it('validates complete login form data', () => {
      const email = 'test@example.com';
      const password = 'password123';

      expect(emailValidation(email)).toBe(true);
      expect(lengthValidation(6, 30)(password)).toBe(true);
    });

    it('identifies invalid form combinations', () => {
      const invalidEmail = 'invalid-email';
      const shortPassword = '123';

      expect(emailValidation(invalidEmail)).toBe(false);
      expect(lengthValidation(6, 30)(shortPassword)).toBe(false);
    });
  });
});
