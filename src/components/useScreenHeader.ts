import { useCallback } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { NavigationInstance } from '../navigation/types';
import { navigationService } from '../services/navigationService';

interface UseScreenHeaderProps {
  showBackButton?: boolean;
  onBackPress?: () => void;
  navigation?: NavigationInstance;
}

export const useScreenHeader = ({
  showBackButton = false,
  onBackPress,
  navigation,
}: UseScreenHeaderProps = {}) => {
  const insets = useSafeAreaInsets();

  const handleBackPress = useCallback(() => {
    if (onBackPress) {
      onBackPress();
    } else {
      try {
        navigationService.goBack();
      } catch (error) {
        // If navigation fails, do nothing - we're likely at the root screen
        // eslint-disable-next-line no-console
        console.warn('Navigation goBack failed:', error);
      }
    }
  }, [onBackPress]);

  const shouldShowBackButton =
    showBackButton && (!!onBackPress || !!navigation);

  return {
    insets,
    handleBackPress,
    shouldShowBackButton,
    canGoBack: !!onBackPress || !!navigation,
  };
};
