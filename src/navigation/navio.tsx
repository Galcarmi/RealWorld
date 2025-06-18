import { Ionicons } from '@expo/vector-icons';

import { Navio } from 'rn-navio';

import { AuthorProfileScreen } from '../screens/authorProfile/authorProfileScreen';
import { EditProfileScreen } from '../screens/editProfile/editProfileScreen';
import { FavoritesScreen } from '../screens/favoritesScreen/favoritesScreen';
import { HomeScreen } from '../screens/homeScreen/homeScreen';
import { LoginScreen as SignInScreen } from '../screens/login/loginScreen';
import { Main as SignUpScreen } from '../screens/login/signUpScreen';
import { NewArticleScreen } from '../screens/newArticle/newArticleScreen';
import { ProfileScreen } from '../screens/profileScreen/profileScreen';
import { navigationService } from '../services/navigationService';
import { themeColors } from '../theme/colors';

import { IoniconsName, TabIconProps } from './types';

const createTabIcon = (iconName: IoniconsName, testId: string) => {
  return ({ color, size }: TabIconProps) => (
    <Ionicons name={iconName} size={size} color={color} testID={testId} />
  );
};

const createTabOptions = (
  title: string,
  iconName: IoniconsName,
  testId: string
) => {
  return () => ({
    title,
    tabBarIcon: createTabIcon(iconName, testId),
  });
};

const getCommonTabBarOptions = () => ({
  tabBarActiveTintColor: themeColors.tabBarActiveTint,
  tabBarInactiveTintColor: themeColors.tabBarInactiveTint,
  tabBarStyle: {
    backgroundColor: themeColors.bgColor,
    borderTopWidth: 1,
    borderTopColor: themeColors.tabBarBorder,
  },
});

const navio = Navio.build({
  screens: {
    SignUp: SignUpScreen,
    SignIn: SignInScreen,
    Home: HomeScreen,
    Favorites: FavoritesScreen,
    Profile: ProfileScreen,
    EditProfile: EditProfileScreen,
    AuthorProfile: AuthorProfileScreen,
    NewArticle: NewArticleScreen,
  },
  stacks: {
    AuthStack: ['SignUp', 'SignIn'],
    HomeStack: ['Home', 'AuthorProfile'],
    FavoritesStack: ['Favorites', 'AuthorProfile'],
    ProfileStack: ['Profile', 'EditProfile', 'NewArticle', 'AuthorProfile'],
    SignInStack: ['SignIn'],
    SignUpStack: ['SignUp'],
  },
  tabs: {
    MainTabs: {
      layout: {
        HomeTab: {
          stack: 'HomeStack',
          options: createTabOptions('Home', 'home', 'home-main-tab-icon'),
        },
        FavoritesTab: {
          stack: 'FavoritesStack',
          options: createTabOptions(
            'Favorites',
            'heart',
            'favorites-main-tab-icon'
          ),
        },
        ProfileTab: {
          stack: 'ProfileStack',
          options: createTabOptions(
            'Profile',
            'person',
            'profile-main-tab-icon'
          ),
        },
      },
      options: getCommonTabBarOptions(),
    },
    AuthTabs: {
      layout: {
        ArticlesTab: {
          stack: 'HomeStack',
          options: createTabOptions('Home', 'home', 'home-tab-icon'),
        },
        LoginTab: {
          stack: 'SignInStack',
          options: createTabOptions('Login', 'log-in', 'login-tab-icon'),
        },
        RegisterTab: {
          stack: 'SignUpStack',
          options: createTabOptions(
            'Register',
            'person-add',
            'register-tab-icon'
          ),
        },
      },
      options: getCommonTabBarOptions(),
    },
  },
  defaultOptions: {
    stacks: {
      screen: {
        headerShown: false,
      },
    },
  },
  root: 'tabs.AuthTabs',
});

navigationService.setNavioInstance(navio);

export { navio };
export type NavioInstance = typeof navio;
