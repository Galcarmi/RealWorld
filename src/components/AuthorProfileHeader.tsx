import React, { useCallback, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Avatar, Button } from 'react-native-ui-lib';

import { Ionicons } from '@expo/vector-icons';

import { TEST_IDS, APP_UI, ICON_NAMES } from '../constants';
import {
  COLORS,
  SPACINGS,
  TYPOGRAPHY,
  DIMENSIONS,
  FONT_WEIGHTS,
} from '../constants/styles';
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

  const getFollowButtonIcon = useCallback(() => {
    return (
      <Ionicons
        name={
          profile.following ? ICON_NAMES.CHECKMARK_SHARP : ICON_NAMES.ADD_SHARP
        }
        size={APP_UI.ICON_SIZES.SMALL}
        color={COLORS.PRIMARY}
      />
    );
  }, [profile.following]);

  return (
    <View style={styles.container}>
      <View style={styles.profileInfo}>
        <Avatar
          source={{ uri: profile.image || undefined }}
          size={APP_UI.ICON_SIZES.AVATAR_LARGE}
          backgroundColor={COLORS.SECONDARY}
          label={getInitials(profile.username, 2)}
        />
        <Text style={styles.username}>{profile.username}</Text>

        <Button
          label={profile.following ? 'Unfollow' : 'Follow'}
          color={profile.following ? COLORS.PRIMARY : COLORS.PRIMARY}
          outline
          outlineColor={COLORS.PRIMARY}
          borderRadius={DIMENSIONS.BORDER_RADIUS_LARGE}
          style={styles.followButton}
          labelStyle={styles.followButtonText}
          onPress={onFollowToggle}
          iconSource={getFollowButtonIcon}
          iconOnRight={false}
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
      paddingBottom: SPACINGS.HEADER_PADDING_BOTTOM,
      paddingTop: SPACINGS.HEADER_PADDING_TOP,
    },
    profileInfo: {
      alignItems: 'center',
    },
    username: {
      fontSize: TYPOGRAPHY.HEADING.fontSize,
      color: COLORS.BLACK,
      textAlign: 'center',
      marginBottom: SPACINGS.PADDING_LARGE,
    },
    followButton: {
      paddingHorizontal: SPACINGS.MARGIN_LARGE,
      gap: SPACINGS.MARGIN_SMALL,
    },
    followButtonText: {
      fontWeight: FONT_WEIGHTS.BOLD,
    },
  });
