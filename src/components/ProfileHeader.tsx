import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { View, Text, Avatar } from 'react-native-ui-lib';

import { User } from '../store/types';
import { themeColors } from '../theme/colors';
import { getInitials } from '../utils';

interface ProfileHeaderProps {
  user: User;
  onEditProfile: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  onEditProfile,
}) => {
  return (
    <View paddingB-30 paddingT-20>
      <View row centerV right marginB-20>
        <TouchableOpacity
          onPress={onEditProfile}
          padding-8
          testID='edit-profile-button'
        >
          <Ionicons
            name='create-outline'
            size={24}
            color={themeColors.primaryColor}
          />
        </TouchableOpacity>
      </View>

      <View center>
        <Avatar
          source={{ uri: user.image || undefined }}
          size={100}
          backgroundColor={themeColors.secondaryColor}
          label={getInitials(user.username, 2)}
          labelColor={themeColors.bgColor}
          marginB-12
        />
        <Text text30 color={themeColors.blackColor} center>
          {user.username}
        </Text>
      </View>
    </View>
  );
};
