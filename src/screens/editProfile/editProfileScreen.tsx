import React, { useMemo } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { View, Button, Text } from 'react-native-ui-lib';

import { observer } from 'mobx-react-lite';
import { NavioScreen } from 'rn-navio';

import { InputField, ScreenHeader } from '../../components';
import { COLORS, DIMENSIONS, FORM_LIMITS, TEST_IDS } from '../../constants';
import { useTranslation } from '../../hooks/useTranslation';

import { useEditProfile } from './useEditProfile';

export const EditProfileScreen: NavioScreen = observer(() => {
  const { t } = useTranslation();
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

  const styles = useMemo(() => createStyles(canUpdate), [canUpdate]);

  return (
    <View style={styles.container} testID={TEST_IDS.EDIT_PROFILE_SCREEN}>
      <ScreenHeader title={t('navigation.editProfile')} showBackButton={true} />

      <ScrollView style={styles.scrollView}>
        <View paddingH-20 paddingV-30>
          <InputField
            placeholder={t('placeholders.profilePictureUrl')}
            value={profileFormValues.image}
            onChangeText={onImageChange}
            validationMessage={[]}
            minLength={0}
            maxLength={FORM_LIMITS.PROFILE_IMAGE_MAX}
            containerStyle={{
              width: DIMENSIONS.WIDTH_80_PERCENT,
              height: DIMENSIONS.HEIGHT_60,
            }}
            testID={TEST_IDS.EDIT_PROFILE_IMAGE_INPUT}
          />

          <InputField
            placeholder={t('placeholders.yourName')}
            value={profileFormValues.username}
            onChangeText={onNameChange}
            validationMessage={[]}
            testID={TEST_IDS.EDIT_PROFILE_USERNAME_INPUT}
          />

          <InputField
            placeholder={t('placeholders.shortBio')}
            value={profileFormValues.bio}
            onChangeText={onBioChange}
            validationMessage={[]}
            minLength={0}
            maxLength={FORM_LIMITS.PROFILE_BIO_MAX}
            testID={TEST_IDS.EDIT_PROFILE_BIO_INPUT}
          />

          <InputField
            placeholder={t('placeholders.yourEmail')}
            value={profileFormValues.email}
            onChangeText={onEmailChange}
            validationMessage={[]}
            maxLength={FORM_LIMITS.PROFILE_EMAIL_MAX}
            testID={TEST_IDS.EDIT_PROFILE_EMAIL_INPUT}
          />

          <InputField
            placeholder={t('placeholders.newPassword')}
            value={profileFormValues.password}
            onChangeText={onPasswordChange}
            validationMessage={[]}
            secureTextEntry={true}
            minLength={0}
            testID={TEST_IDS.EDIT_PROFILE_PASSWORD_INPUT}
          />

          <View marginT-30>
            <Button
              label={t('common.update')}
              onPress={onUpdateProfile}
              fullWidth
              backgroundColor={styles.updateButton.backgroundColor}
              disabled={!canUpdate}
              testID={TEST_IDS.EDIT_PROFILE_UPDATE_BUTTON}
            />

            <Text center color={COLORS.GREY} marginT-20 marginB-10>
              {t('common.or')}
            </Text>

            <Button
              label={t('auth.logout')}
              onPress={onLogout}
              backgroundColor='transparent'
              color={COLORS.ERROR}
              testID={TEST_IDS.EDIT_PROFILE_LOGOUT_BUTTON}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
});

const createStyles = (canUpdate: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.BACKGROUND,
    },
    scrollView: {
      width: '100%',
    },
    updateButton: {
      backgroundColor: canUpdate ? COLORS.PRIMARY : COLORS.GREY,
    },
  });
