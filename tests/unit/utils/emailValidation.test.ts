import { emailValidation } from '../../../src/utils';
import { testData, expectValidationResults } from '../../utils/testHelpers';

describe('emailValidation', () => {
  it('should return true for valid email addresses', () => {
    expectValidationResults(emailValidation, testData.validEmails, [], true);
  });

  it('should return false for invalid email addresses', () => {
    expectValidationResults(
      emailValidation,
      [],
      testData.invalidEmails,
      true,
      false
    );
  });

  it('should return false for undefined input', () => {
    expect(emailValidation(undefined)).toBe(false);
  });

  it('should return false for null input', () => {
    expect(emailValidation(null as unknown as string)).toBe(false);
  });
});
