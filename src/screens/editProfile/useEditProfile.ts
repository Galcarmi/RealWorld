import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';
import { Keyboard } from 'react-native';

import { RootStackParamList } from '../../navigation/types';
import { AuthService } from '../../services';
import { ResponseErrors } from '../../services/types';
import { authStore } from '../../store/authStore';
import { User } from '../../store/types';
import { userStore } from '../../store/userStore';
import { showErrorModals } from '../../utils';

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

  const authService = new AuthService(authStore, userStore);

  useEffect(() => {
    const currentUser = userStore.user;
    if (currentUser) {
      setProfileFormValues({
        image: currentUser.image || '',
        username: currentUser.username || '',
        bio: currentUser.bio || '',
        email: currentUser.email || '',
        password: '',
      });
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

      const response = await authService.put(updateData as User);

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
  }, [profileFormValues, authService, navigation]);

  const onLogout = useCallback(() => {
    authStore.logout();
  }, []);

  return {
    profileFormValues,
    isLoading,
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
