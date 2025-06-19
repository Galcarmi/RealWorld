import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Avatar, Button } from 'react-native-ui-lib';

import { TEST_IDS, APP_UI } from '../constants';
import { themeColors } from '../constants/styles';
import { Profile } from '../services/types';
import { getInitials } from '../utils';

interface AuthorProfileHeaderProps {
  profile: Profile;
  onFollowToggle: () => void;
}

export const AuthorProfileHeader: React.FC<AuthorProfileHeaderProps> = ({
  profile,
  onFollowToggle,
}) => {
  const styles = useMemo(() => createStyles(), []);

  return (
    <View style={styles.container}>
      <View style={styles.profileInfo}>
        <Avatar
          source={{ uri: profile.image || undefined }}
          size={APP_UI.ICON_SIZES.AVATAR_LARGE}
          backgroundColor={themeColors.secondaryColor}
          label={getInitials(profile.username, 2)}
          labelColor={themeColors.bgColor}
          marginB-12
        />
        <Text style={styles.username}>{profile.username}</Text>

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

const createStyles = () =>
  StyleSheet.create({
    container: {
      paddingBottom: 30,
      paddingTop: 20,
    },
    profileInfo: {
      alignItems: 'center',
    },
    username: {
      fontSize: 22,
      color: themeColors.blackColor,
      textAlign: 'center',
      marginBottom: 16,
    },
  });
