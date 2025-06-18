import { formatDate } from '../../../src/utils';
import { testData, expectStringResult } from '../../utils/testHelpers';

describe('formatDate', () => {
  it('should format a valid date string correctly', () => {
    const dateString = testData.validDates[0];
    const result = formatDate(dateString);

    expectStringResult(result);
  });

  it('should handle date without time', () => {
    const dateString = testData.validDates[1];
    const result = formatDate(dateString);

    expectStringResult(result);
  });

  it('should handle ISO date strings', () => {
    const dateString = testData.validDates[2];
    const result = formatDate(dateString);

    expect(typeof result).toBe('string');
    expect(result).toMatch(/12\/25\/2024|Dec 25, 2024|25\/12\/2024/);
  });

  it('should handle invalid date strings gracefully', () => {
    const invalidDate = testData.invalidDates[0];
    const result = formatDate(invalidDate);

    expect(typeof result).toBe('string');
  });

  it('should handle empty string', () => {
    const result = formatDate(testData.invalidDates[1]);

    expect(typeof result).toBe('string');
  });
});
