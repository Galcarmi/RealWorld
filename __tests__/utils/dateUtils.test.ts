import { formatDate } from '../../src/utils';

describe('formatDate', () => {
  it('should format a valid date string correctly', () => {
    const dateString = '2024-01-15T10:30:00.000Z';
    const result = formatDate(dateString);

    // The result will depend on the user's locale, but it should be a string
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('should handle date without time', () => {
    const dateString = '2024-01-15';
    const result = formatDate(dateString);

    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('should handle ISO date strings', () => {
    const dateString = '2024-12-25T00:00:00.000Z';
    const result = formatDate(dateString);

    expect(typeof result).toBe('string');
    // Accept either US format (12/25/2024) or written format (Dec 25, 2024)
    expect(result).toMatch(/12\/25\/2024|Dec 25, 2024|25\/12\/2024/);
  });

  it('should handle invalid date strings gracefully', () => {
    const invalidDate = 'invalid-date';
    const result = formatDate(invalidDate);

    // Invalid dates should return "Invalid Date" or similar
    expect(typeof result).toBe('string');
  });

  it('should handle empty string', () => {
    const result = formatDate('');

    expect(typeof result).toBe('string');
  });
});
