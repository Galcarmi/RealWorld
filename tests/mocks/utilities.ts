// Mock utility functions
export const mockUtilities = {
  showErrorModals: jest.fn(),
  lengthValidation: jest.fn(() => jest.fn(() => true)),
  emailValidation: jest.fn(() => true),
  showErrorAlert: jest.fn(),
  showInfoAlert: jest.fn(),
  showConfirmAlert: jest.fn(),
  getInitials: jest.fn((name: string, count: number) =>
    name.substring(0, count)
  ),
  getUserInitial: jest.fn((username: string) => username.substring(0, 1)),
  formatDate: jest.fn(() => 'Mocked Date'),
};

// Jest module mock for utilities
jest.mock('../../src/utils', () => mockUtilities);

// Export for use in tests
export const getMockShowErrorModals = () => mockUtilities.showErrorModals;
export const getMockLengthValidation = () => mockUtilities.lengthValidation;
export const getMockEmailValidation = () => mockUtilities.emailValidation;
export const getMockShowErrorAlert = () => mockUtilities.showErrorAlert;
export const getMockShowInfoAlert = () => mockUtilities.showInfoAlert;
export const getMockShowConfirmAlert = () => mockUtilities.showConfirmAlert;
export const getMockGetInitials = () => mockUtilities.getInitials;
export const getMockGetUserInitial = () => mockUtilities.getUserInitial;
export const getMockFormatDate = () => mockUtilities.formatDate;

// Helper to reset all utility mocks
export const resetAllUtilityMocks = (): void => {
  jest.clearAllMocks();
  mockUtilities.lengthValidation.mockImplementation(() => jest.fn(() => true));
  mockUtilities.emailValidation.mockImplementation(() => true);
  mockUtilities.getInitials.mockImplementation((name: string, count: number) =>
    name.substring(0, count)
  );
  mockUtilities.getUserInitial.mockImplementation((username: string) =>
    username.substring(0, 1)
  );
  mockUtilities.formatDate.mockImplementation(() => 'Mocked Date');
};
