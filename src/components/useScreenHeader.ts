import { useCallback } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { navio } from '../navigation/navio';

interface UseScreenHeaderProps {
  showBackButton?: boolean;
  onBackPress?: () => void;
}

export const useScreenHeader = ({
  showBackButton = false,
  onBackPress,
}: UseScreenHeaderProps = {}) => {
  const navigation = navio.useN();
  const insets = useSafeAreaInsets();

  const handleBackPress = useCallback(() => {
    if (onBackPress) {
      onBackPress();
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    }
  }, [onBackPress, navigation]);

  const canGoBack = navigation.canGoBack();
  const shouldShowBackButton = showBackButton && canGoBack;

  return {
    insets,
    handleBackPress,
    shouldShowBackButton,
    canGoBack,
  };
};
