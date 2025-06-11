import { useCallback } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { NavigationInstance } from '../navigation/types';

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
    } else if (navigation?.canGoBack()) {
      navigation.goBack();
    }
  }, [onBackPress, navigation]);

  const canGoBack = navigation?.canGoBack() ?? true;
  const shouldShowBackButton = showBackButton && canGoBack;

  return {
    insets,
    handleBackPress,
    shouldShowBackButton,
    canGoBack,
  };
};
