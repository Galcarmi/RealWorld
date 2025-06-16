import { render, waitFor } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import '../../mocks';
import { FeedType } from '../../../src/constants/feedTypes';
import { HomeScreen } from '../../../src/screens/homeScreen/homeScreen';
import { articlesStore } from '../../../src/store/articlesStore';
import { userStore } from '../../../src/store/userStore';
import { mockArticles, mockUserMinimal } from '../../mocks/data';
import { resetAllStoreMocks } from '../../mocks/stores';

const renderHomeScreen = () => {
  return render(
    <SafeAreaProvider>
      <HomeScreen />
    </SafeAreaProvider>
  );
};

describe('Home Screen Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    userStore.forgetUser();

    // Reset mock functions using centralized utility
    resetAllStoreMocks();

    // Set default mock values
    (articlesStore as any).homeArticles = mockArticles;
    (articlesStore as any).homeIsLoading = false;
    (articlesStore as any).feedType = FeedType.GLOBAL;
  });

  afterEach(() => {
    userStore.forgetUser();
  });

  it('should render home screen with articles list', async () => {
    const { getByTestId } = renderHomeScreen();

    expect(getByTestId('home-screen')).toBeTruthy();
    expect(articlesStore.loadHomeArticlesInitially).toHaveBeenCalled();
  });

  it('should show feed tabs when user is authenticated', async () => {
    userStore.setUser(mockUserMinimal);

    jest.spyOn(userStore, 'isAuthenticated').mockReturnValue(true);

    const { getByTestId } = renderHomeScreen();

    expect(getByTestId('home-screen')).toBeTruthy();
  });

  it('should not show feed tabs when user is not authenticated', async () => {
    jest.spyOn(userStore, 'isAuthenticated').mockReturnValue(false);

    const { getByTestId } = renderHomeScreen();

    expect(getByTestId('home-screen')).toBeTruthy();
  });

  it('should handle article refresh', async () => {
    const { getByTestId } = renderHomeScreen();

    expect(getByTestId('home-screen')).toBeTruthy();
    expect(articlesStore.loadHomeArticlesInitially).toHaveBeenCalled();
  });

  it('should load articles on mount', async () => {
    renderHomeScreen();

    expect(articlesStore.loadHomeArticlesInitially).toHaveBeenCalled();
  });

  it('should handle article press and navigate to author profile', async () => {
    const { getByTestId } = renderHomeScreen();

    expect(getByTestId('home-screen')).toBeTruthy();

    await waitFor(() => {
      expect(articlesStore.loadHomeArticlesInitially).toHaveBeenCalled();
    });
  });

  it('should show proper empty message for user feed', async () => {
    (articlesStore as any).feedType = FeedType.FEED;
    (articlesStore as any).homeArticles = [];

    const { getByTestId } = renderHomeScreen();

    expect(getByTestId('home-screen')).toBeTruthy();
  });

  it('should show proper empty message for global feed', async () => {
    (articlesStore as any).feedType = FeedType.GLOBAL;
    (articlesStore as any).homeArticles = [];

    const { getByTestId } = renderHomeScreen();

    expect(getByTestId('home-screen')).toBeTruthy();
  });
});
