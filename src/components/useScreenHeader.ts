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
        // eslint-disable-next-line no-empty
      } catch {}
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
