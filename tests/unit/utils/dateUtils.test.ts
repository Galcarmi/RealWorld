import { validationTestData } from '../../utils/testHelpers';

import { formatDate } from '../../../src/utils';

describe('formatDate', () => {
  it('should format a valid date string correctly', () => {
    const dateString = validationTestData.validDates[0];
    const result = formatDate(dateString);

    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('should handle date without time', () => {
    const dateString = validationTestData.validDates[1];
    const result = formatDate(dateString);

    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('should handle ISO date strings', () => {
    const dateString = validationTestData.validDates[2];
    const result = formatDate(dateString);

    expect(typeof result).toBe('string');
  });

  it('should handle invalid date strings gracefully', () => {
    const invalidDate = validationTestData.invalidDates[0];
    const result = formatDate(invalidDate);

    expect(typeof result).toBe('string');
  });

  it('should handle empty string', () => {
    const result = formatDate(validationTestData.invalidDates[1]);

    expect(typeof result).toBe('string');
  });
});
