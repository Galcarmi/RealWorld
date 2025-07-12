import { useCallback, useEffect, useState, useMemo } from 'react';
import { Keyboard } from 'react-native';

import { NavigationProp, useNavigation } from '@react-navigation/native';

import { authStore } from '../../store/authStore';
import { User } from '../../store/types';
import { userStore } from '../../store/userStore';

import { RootStackParamList } from '../../navigation/types';

import { authService, ResponseErrors } from '../../services';
import { showErrorModals, validateProfileForm } from '../../utils';

type NavigationProps = NavigationProp<RootStackParamList>;

interface ProfileFormValues {
  image: string;
  username: string;
  bio: string;
  email: string;
  password: string;
}

interface UpdateUserData {
  email: string;
  username: string;
  bio: string;
  image: string;
  password?: string;
}

const useEditProfile = () => {
  const navigation = useNavigation<NavigationProps>();
  const [isLoading, setIsLoading] = useState(false);
  const [profileFormValues, setProfileFormValues] = useState<ProfileFormValues>(
    {
      image: '',
      username: '',
      bio: '',
      email: '',
      password: '',
    }
  );
  const [initialValues, setInitialValues] = useState<ProfileFormValues>({
    image: '',
    username: '',
    bio: '',
    email: '',
    password: '',
  });

  const isFormValid = useMemo(() => {
    return validateProfileForm(profileFormValues);
  }, [profileFormValues]);

  const hasChanges = useMemo(() => {
    return (
      profileFormValues.image !== initialValues.image ||
      profileFormValues.username !== initialValues.username ||
      profileFormValues.bio !== initialValues.bio ||
      profileFormValues.email !== initialValues.email ||
      profileFormValues.password.trim().length > 0
    );
  }, [profileFormValues, initialValues]);

  const canUpdate = isFormValid && hasChanges && !isLoading;

  useEffect(() => {
    const currentUser = userStore.user;
    if (currentUser) {
      const values = {
        image: currentUser.image || '',
        username: currentUser.username || '',
        bio: currentUser.bio || '',
        email: currentUser.email || '',
        password: '',
      };
      setProfileFormValues(values);
      setInitialValues(values);
    }
  }, []);

  const onImageChange = useCallback((value: string) => {
    setProfileFormValues(prev => ({ ...prev, image: value }));
  }, []);

  const onNameChange = useCallback((value: string) => {
    setProfileFormValues(prev => ({ ...prev, username: value }));
  }, []);

  const onBioChange = useCallback((value: string) => {
    setProfileFormValues(prev => ({ ...prev, bio: value }));
  }, []);

  const onEmailChange = useCallback((value: string) => {
    setProfileFormValues(prev => ({ ...prev, email: value }));
  }, []);

  const onPasswordChange = useCallback((value: string) => {
    setProfileFormValues(prev => ({ ...prev, password: value }));
  }, []);

  const onUpdateProfile = useCallback(async () => {
    Keyboard.dismiss();
    setIsLoading(true);

    try {
      const updateData: UpdateUserData = {
        email: profileFormValues.email,
        username: profileFormValues.username,
        bio: profileFormValues.bio,
        image: profileFormValues.image,
      };

      if (profileFormValues.password.trim()) {
        updateData.password = profileFormValues.password;
      }

      const response = await authService.updateUser(updateData as User);

      userStore.setUser(response.user);

      navigation.goBack();
    } catch (error) {
      const apiError = error as {
        response?: { data?: { errors?: ResponseErrors } };
      };
      if (apiError?.response?.data?.errors) {
        showErrorModals(apiError.response.data.errors);
      } else {
        showErrorModals({ general: ['Failed to update profile'] });
      }
    } finally {
      setIsLoading(false);
    }
  }, [profileFormValues, navigation]);

  const onLogout = useCallback(() => {
    authStore.logout();
  }, []);

  return {
    profileFormValues,
    isLoading,
    canUpdate,
    onImageChange,
    onNameChange,
    onBioChange,
    onEmailChange,
    onPasswordChange,
    onUpdateProfile,
    onLogout,
  };
};

export { useEditProfile };
