import { lengthValidation } from '../../src/utils';

describe('lengthValidation', () => {
  describe('with default parameters (6-30 characters)', () => {
    const validate = lengthValidation(6, 30);

    it('should return true for valid length strings', () => {
      expect(validate('password')).toBe(true);
      expect(validate('123456')).toBe(true);
      expect(validate('a'.repeat(30))).toBe(true);
    });

    it('should return false for strings that are too short', () => {
      expect(validate('')).toBe(false);
      expect(validate('12345')).toBe(false);
    });

    it('should return false for strings that are too long', () => {
      expect(validate('a'.repeat(31))).toBe(false);
      expect(validate('a'.repeat(100))).toBe(false);
    });

    it('should return false for undefined input', () => {
      expect(validate(undefined)).toBe(false);
    });
  });

  describe('with custom parameters', () => {
    it('should validate minimum length correctly', () => {
      const validate = lengthValidation(3, 10);

      expect(validate('ab')).toBe(false);
      expect(validate('abc')).toBe(true);
      expect(validate('1234567890')).toBe(true);
      expect(validate('12345678901')).toBe(false);
    });

    it('should validate maximum length correctly', () => {
      const validate = lengthValidation(1, 5);

      expect(validate('a')).toBe(true);
      expect(validate('abcde')).toBe(true);
      expect(validate('abcdef')).toBe(false);
    });

    it('should handle edge case where min equals max', () => {
      const validate = lengthValidation(5, 5);

      expect(validate('1234')).toBe(false);
      expect(validate('12345')).toBe(true);
      expect(validate('123456')).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('should handle zero minimum length', () => {
      const validate = lengthValidation(0, 5);

      expect(validate('')).toBe(true);
      expect(validate('12345')).toBe(true);
      expect(validate('123456')).toBe(false);
    });

    it('should handle whitespace correctly', () => {
      const validate = lengthValidation(3, 10);

      expect(validate('   ')).toBe(true); // 3 spaces (length 3)
      expect(validate('  a  ')).toBe(true); // 5 characters including spaces
    });
  });
});
