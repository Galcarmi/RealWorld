import {
  validationTestData,
  expectValidationResults,
} from '../../utils/testHelpers';

import { emailValidation } from '../../../src/utils';

describe('emailValidation', () => {
  it('should return true for valid email addresses', () => {
    expectValidationResults(
      emailValidation,
      validationTestData.validEmails,
      []
    );
  });

  it('should return false for invalid email addresses', () => {
    expectValidationResults(
      emailValidation,
      [],
      validationTestData.invalidEmails
    );
  });

  it('should return false for undefined input', () => {
    expect(emailValidation(undefined)).toBe(false);
  });

  it('should return false for null input', () => {
    expect(emailValidation(null as unknown as string)).toBe(false);
  });
});
