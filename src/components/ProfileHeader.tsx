import React, { useMemo } from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Avatar } from 'react-native-ui-lib';

import { Ionicons } from '@expo/vector-icons';

import { TEST_IDS, APP_UI, ICON_NAMES } from '../constants';
import { themeColors } from '../constants/styles';
import { User } from '../store/types';
import { getInitials } from '../utils';

interface ProfileHeaderProps {
  user: User;
  onEditProfile: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  onEditProfile,
}) => {
  const styles = useMemo(() => createStyles(), []);

  return (
    <View style={styles.container}>
      <View style={styles.editButtonContainer}>
        <TouchableOpacity
          onPress={onEditProfile}
          style={styles.editButton}
          testID={TEST_IDS.EDIT_PROFILE_BUTTON}
        >
          <Ionicons
            name={ICON_NAMES.CREATE_OUTLINE}
            size={APP_UI.ICON_SIZES.LARGE}
            color={themeColors.primaryColor}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.profileInfo}>
        <Avatar
          source={{ uri: user?.image || undefined }}
          size={APP_UI.ICON_SIZES.AVATAR_LARGE}
          backgroundColor={themeColors.secondaryColor}
          label={getInitials(user?.username || '', 2)}
          labelColor={themeColors.bgColor}
          marginB-12
        />
        <Text style={styles.username}>{user.username}</Text>
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
    editButtonContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      marginBottom: 20,
    },
    editButton: {
      padding: 8,
    },
    profileInfo: {
      alignItems: 'center',
    },
    username: {
      fontSize: 22,
      color: themeColors.blackColor,
      textAlign: 'center',
    },
  });
