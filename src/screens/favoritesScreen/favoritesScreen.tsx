import React from 'react';
import { View, Text } from 'react-native-ui-lib';

interface FavoritesScreenProps {
  // Define props even if empty initially
}

export const FavoritesScreen: React.FC<FavoritesScreenProps> = () => {
  return (
    <View flex center>
      <Text text50 bold>
        Favorites
      </Text>
    </View>
  );
};
