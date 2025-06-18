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

jest.mock('../../src/utils', () => mockUtilities);

export const resetUtilityMocks = (): void => {
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
