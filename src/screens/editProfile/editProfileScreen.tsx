import { observer } from 'mobx-react-lite';
import React from 'react';
import { ScrollView } from 'react-native';
import { Button, Text, View } from 'react-native-ui-lib';
import { NavioScreen } from 'rn-navio';

import { InputField } from '../../components/InputField';
import { ScreenHeader } from '../../components/ScreenHeader';
import { componentStyles } from '../../styles/componentStyles';
import { styles } from '../../styles/globalStyles';
import { themeColors } from '../../theme/colors';

import { useEditProfile } from './useEditProfile';

export const EditProfileScreen: NavioScreen = observer(() => {
  const {
    profileFormValues,
    isLoading,
    onImageChange,
    onNameChange,
    onBioChange,
    onEmailChange,
    onPasswordChange,
    onUpdateProfile,
    onLogout,
  } = useEditProfile();

  return (
    <View style={componentStyles.homeScreenSafeArea}>
      <ScreenHeader title='Edit Profile' showBackButton={true} />

      <ScrollView style={styles.width100Percent}>
        <View paddingH-20 paddingV-30>
          <InputField
            placeholder='URL of profile picture'
            value={profileFormValues.image}
            onChangeText={onImageChange}
            validationMessage={[]}
            minLength={0}
            maxLength={200}
            containerStyle={{ ...styles.width80Percent, ...styles.height60px }}
          />

          <InputField
            placeholder='Your name'
            value={profileFormValues.username}
            onChangeText={onNameChange}
            validationMessage={[]}
          />

          <InputField
            placeholder='A short bio about you'
            value={profileFormValues.bio}
            onChangeText={onBioChange}
            validationMessage={[]}
            minLength={0}
            maxLength={300}
          />

          <InputField
            placeholder='Your email'
            value={profileFormValues.email}
            onChangeText={onEmailChange}
            validationMessage={[]}
            maxLength={50}
          />

          <InputField
            placeholder='New password'
            value={profileFormValues.password}
            onChangeText={onPasswordChange}
            validationMessage={[]}
            secureTextEntry={true}
            minLength={0}
          />

          <View marginT-30>
            <Button
              label='Update'
              onPress={onUpdateProfile}
              fullWidth
              backgroundColor={themeColors.primaryColor}
              disabled={isLoading}
            />

            <Text center color={themeColors.greyColor} marginT-20 marginB-10>
              Or
            </Text>

            <Button
              label='Log out'
              onPress={onLogout}
              backgroundColor='transparent'
              color={themeColors.errorColor}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
});
