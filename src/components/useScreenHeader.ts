import { useCallback } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { NavigationInstance } from '../navigation/types';
import { navigationService } from '../services/navigationService';
import { Logger } from '../utils';

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

  const attemptGoBack = useCallback(() => {
    try {
      navigationService.goBack();
    } catch (error) {
      Logger.warn('Navigation goBack failed:', error);
    }
  }, []);

  const handleBackPress = useCallback(() => {
    if (onBackPress) {
      onBackPress();
    } else {
      attemptGoBack();
    }
  }, [onBackPress, attemptGoBack]);

  const shouldShowBackButton =
    showBackButton && (!!onBackPress || !!navigation);

  return {
    insets,
    handleBackPress,
    shouldShowBackButton,
    canGoBack: !!onBackPress || !!navigation,
  };
};
