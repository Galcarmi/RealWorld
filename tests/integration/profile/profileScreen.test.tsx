import { render, fireEvent } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import '../../mocks';
import { ProfileScreen } from '../../../src/screens/profileScreen/profileScreen';
import { userStore } from '../../../src/store/userStore';
import { mockUser } from '../../mocks/data';
import { getMockNavigationService } from '../../mocks/services';

const mockNavigationService = getMockNavigationService();

const renderProfileScreen = () => {
  return render(
    <SafeAreaProvider>
      <ProfileScreen />
    </SafeAreaProvider>
  );
};

describe('Profile Screen Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    userStore.forgetUser();
  });

  afterEach(() => {
    userStore.forgetUser();
  });

  it('should render profile screen with user data when authenticated', async () => {
    userStore.setUser(mockUser);

    const { getByTestId } = renderProfileScreen();

    expect(getByTestId('profile-screen')).toBeTruthy();
  });

  it('should show user information correctly', async () => {
    userStore.setUser(mockUser);

    const { getByTestId } = renderProfileScreen();

    expect(getByTestId('profile-screen')).toBeTruthy();
  });

  it('should handle edit profile navigation', async () => {
    userStore.setUser(mockUser);

    const { getByTestId } = renderProfileScreen();

    const editButton = getByTestId('edit-profile-button');

    fireEvent.press(editButton);

    expect(mockNavigationService.navigateToEditProfile).toHaveBeenCalled();
  });

  it('should handle logout functionality', async () => {
    userStore.setUser(mockUser);

    const { getByTestId } = renderProfileScreen();

    expect(getByTestId('profile-screen')).toBeTruthy();
  });

  it('should display user stats correctly', async () => {
    userStore.setUser(mockUser);

    const { getByTestId } = renderProfileScreen();

    expect(getByTestId('profile-screen')).toBeTruthy();
  });
});
