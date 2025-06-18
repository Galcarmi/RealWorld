import React from 'react';
import { View, Text, Avatar, Button } from 'react-native-ui-lib';

import { TEST_IDS } from '../constants';
import { Profile } from '../services/types';
import { themeColors } from '../theme/colors';
import { getInitials } from '../utils';

interface AuthorProfileHeaderProps {
  profile: Profile;
  onFollowToggle: () => void;
}

export const AuthorProfileHeader: React.FC<AuthorProfileHeaderProps> = ({
  profile,
  onFollowToggle,
}) => {
  return (
    <View paddingB-30 paddingT-20>
      <View center>
        <Avatar
          source={{ uri: profile.image || undefined }}
          size={100}
          backgroundColor={themeColors.secondaryColor}
          label={getInitials(profile.username, 2)}
          labelColor={themeColors.bgColor}
          marginB-12
        />
        <Text text30 color={themeColors.blackColor} center marginB-16>
          {profile.username}
        </Text>

        <Button
          label={profile.following ? 'Unfollow' : 'Follow'}
          backgroundColor={
            profile.following ? themeColors.greyColor : themeColors.primaryColor
          }
          color={themeColors.bgColor}
          borderRadius={25}
          paddingH-20
          paddingV-8
          onPress={onFollowToggle}
          testID={
            profile.following
              ? TEST_IDS.UNFOLLOW_BUTTON
              : TEST_IDS.FOLLOW_BUTTON
          }
        />
      </View>
    </View>
  );
};
