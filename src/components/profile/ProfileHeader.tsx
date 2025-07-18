import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';
import { Avatar } from 'react-native-ui-lib';

import { Ionicons } from '@expo/vector-icons';

import { User } from '../../store/types';

import {
  COLORS,
  TYPOGRAPHY,
  SPACINGS,
  FONT_SIZES,
} from '../../constants/styles';

import { TEST_IDS, APP_UI, ICON_NAMES } from '../../constants';
import { getInitials } from '../../utils';

interface ProfileHeaderProps {
  user: User;
  onEditProfile: () => void;
  usernameStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  onEditProfile,
  usernameStyle,
  containerStyle,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.editButtonContainer}>
        <TouchableOpacity
          onPress={onEditProfile}
          style={styles.editButton}
          testID={TEST_IDS.EDIT_PROFILE_BUTTON}
        >
          <Ionicons
            name={ICON_NAMES.CREATE_OUTLINE}
            size={APP_UI.ICON_SIZES.LARGE}
            color={COLORS.PRIMARY}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.profileInfo}>
        <Avatar
          source={{ uri: user?.image || undefined }}
          size={APP_UI.ICON_SIZES.AVATAR_LARGE}
          backgroundColor={COLORS.SECONDARY}
          label={getInitials(user?.username || '', 2)}
          labelColor={COLORS.BACKGROUND}
          marginB-12
        />
        <Text style={[styles.username, usernameStyle]}>{user.username}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  editButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: SPACINGS.LARGE,
  },
  editButton: {
    padding: SPACINGS.SMALL,
  },
  profileInfo: {
    alignItems: 'center',
  },
  username: {
    fontSize: FONT_SIZES.EXTRA_LARGE,
    color: COLORS.BLACK,
    fontFamily: TYPOGRAPHY.BOLD.fontFamily,
    textAlign: 'center',
  },
  container: {
    padding: SPACINGS.LARGE,
  },
});
