import React, { useCallback, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Avatar, Button } from 'react-native-ui-lib';

import { Ionicons } from '@expo/vector-icons';

import { observer } from 'mobx-react';

import {
  COLORS,
  SPACINGS,
  TYPOGRAPHY,
  DIMENSIONS,
  FONT_WEIGHTS,
} from '../../constants/styles';

import { TEST_IDS, APP_UI, ICON_NAMES } from '../../constants';
import { useTranslation } from '../../hooks/useTranslation';
import { Profile } from '../../services';
import { getInitials } from '../../utils';

interface AuthorProfileHeaderProps {
  profile: Profile;
  onFollowToggle: () => void;
}

export const AuthorProfileHeader: React.FC<AuthorProfileHeaderProps> = observer(
  ({ profile, onFollowToggle }) => {
    const { t } = useTranslation();
    const styles = useMemo(() => createStyles(), []);

    const getFollowButtonIcon = useCallback(() => {
      return (
        <Ionicons
          name={
            profile.following
              ? ICON_NAMES.CHECKMARK_SHARP
              : ICON_NAMES.ADD_SHARP
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
            labelColor={COLORS.BACKGROUND}
            label={getInitials(profile.username, 2)}
          />
          <Text style={styles.username}>{profile.username}</Text>

          <Button
            label={
              profile.following ? t('common.unfollow') : t('common.follow')
            }
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
  }
);

const createStyles = () =>
  StyleSheet.create({
    container: {
      paddingBottom: SPACINGS.HEADER_BOTTOM,
      paddingTop: SPACINGS.HEADER_TOP,
    },
    profileInfo: {
      alignItems: 'center',
    },
    username: {
      fontSize: TYPOGRAPHY.HEADING.fontSize,
      color: COLORS.BLACK,
      textAlign: 'center',
      marginBottom: SPACINGS.LARGE,
    },
    followButton: {
      paddingHorizontal: SPACINGS.LARGE,
      gap: SPACINGS.SMALL,
    },
    followButtonText: {
      fontWeight: FONT_WEIGHTS.BOLD,
    },
  });
