import React from 'react';
import { ScrollView } from 'react-native';
import { Button, Text, View } from 'react-native-ui-lib';

import { observer } from 'mobx-react-lite';
import { NavioScreen } from 'rn-navio';

import { themeColors } from '../../constants/styles';

import { componentStyles } from '../../styles/componentStyles';
import { styles } from '../../styles/globalStyles';

import { InputField } from '../../components/InputField';
import { ScreenHeader } from '../../components/ScreenHeader';
import { FORM_LIMITS, TEST_IDS } from '../../constants';

import { useEditProfile } from './useEditProfile';

export const EditProfileScreen: NavioScreen = observer(() => {
  const {
    profileFormValues,
    canUpdate,
    onImageChange,
    onNameChange,
    onBioChange,
    onEmailChange,
    onPasswordChange,
    onUpdateProfile,
    onLogout,
  } = useEditProfile();

  return (
    <View
      style={componentStyles.homeScreenSafeArea}
      testID={TEST_IDS.EDIT_PROFILE_SCREEN}
    >
      <ScreenHeader title='Edit Profile' showBackButton={true} />

      <ScrollView style={styles.width100Percent}>
        <View paddingH-20 paddingV-30>
          <InputField
            placeholder='URL of profile picture'
            value={profileFormValues.image}
            onChangeText={onImageChange}
            validationMessage={[]}
            minLength={0}
            maxLength={FORM_LIMITS.PROFILE_IMAGE_MAX}
            containerStyle={{ ...styles.width80Percent, ...styles.height60px }}
            testID={TEST_IDS.EDIT_PROFILE_IMAGE_INPUT}
          />

          <InputField
            placeholder='Your name'
            value={profileFormValues.username}
            onChangeText={onNameChange}
            validationMessage={[]}
            testID={TEST_IDS.EDIT_PROFILE_USERNAME_INPUT}
          />

          <InputField
            placeholder='A short bio about you'
            value={profileFormValues.bio}
            onChangeText={onBioChange}
            validationMessage={[]}
            minLength={0}
            maxLength={FORM_LIMITS.PROFILE_BIO_MAX}
            testID={TEST_IDS.EDIT_PROFILE_BIO_INPUT}
          />

          <InputField
            placeholder='Your email'
            value={profileFormValues.email}
            onChangeText={onEmailChange}
            validationMessage={[]}
            maxLength={FORM_LIMITS.PROFILE_EMAIL_MAX}
            testID={TEST_IDS.EDIT_PROFILE_EMAIL_INPUT}
          />

          <InputField
            placeholder='New password'
            value={profileFormValues.password}
            onChangeText={onPasswordChange}
            validationMessage={[]}
            secureTextEntry={true}
            minLength={0}
            testID={TEST_IDS.EDIT_PROFILE_PASSWORD_INPUT}
          />

          <View marginT-30>
            <Button
              label='Update'
              onPress={onUpdateProfile}
              fullWidth
              backgroundColor={
                canUpdate ? themeColors.primaryColor : themeColors.greyColor
              }
              disabled={!canUpdate}
              testID={TEST_IDS.EDIT_PROFILE_UPDATE_BUTTON}
            />

            <Text center color={themeColors.greyColor} marginT-20 marginB-10>
              Or
            </Text>

            <Button
              label='Log out'
              onPress={onLogout}
              backgroundColor='transparent'
              color={themeColors.errorColor}
              testID={TEST_IDS.EDIT_PROFILE_LOGOUT_BUTTON}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
});
