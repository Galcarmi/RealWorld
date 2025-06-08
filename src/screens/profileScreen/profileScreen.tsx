import React from 'react';
import { View, Text } from 'react-native-ui-lib';

interface ProfileScreenProps {
  // Define props even if empty initially
}

export const ProfileScreen: React.FC<ProfileScreenProps> = () => {
  return (
    <View flex center>
      <Text text50 bold>
        Profile
      </Text>
    </View>
  );
};
