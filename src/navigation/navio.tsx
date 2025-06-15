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
          options: () => ({
            title: 'Home',
            tabBarIcon: ({ color, size }) => (
              <Ionicons
                name='home'
                size={size}
                color={color}
                testID='home-main-tab-icon'
              />
            ),
          }),
        },
        FavoritesTab: {
          stack: 'FavoritesStack',
          options: () => ({
            title: 'Favorites',
            tabBarIcon: ({ color, size }) => (
              <Ionicons
                name='heart'
                size={size}
                color={color}
                testID='favorites-main-tab-icon'
              />
            ),
          }),
        },
        ProfileTab: {
          stack: 'ProfileStack',
          options: () => ({
            title: 'Profile',
            tabBarIcon: ({ color, size }) => (
              <Ionicons
                name='person'
                size={size}
                color={color}
                testID='profile-main-tab-icon'
              />
            ),
          }),
        },
      },
      options: {
        tabBarActiveTintColor: themeColors.tabBarActiveTint,
        tabBarInactiveTintColor: themeColors.tabBarInactiveTint,
        tabBarStyle: {
          backgroundColor: themeColors.bgColor,
          borderTopWidth: 1,
          borderTopColor: themeColors.tabBarBorder,
        },
      },
    },
    AuthTabs: {
      layout: {
        ArticlesTab: {
          stack: 'HomeStack',
          options: () => ({
            title: 'Home',
            tabBarIcon: ({ color, size }) => (
              <Ionicons
                name='home'
                size={size}
                color={color}
                testID='home-tab-icon'
              />
            ),
          }),
        },
        LoginTab: {
          stack: 'SignInStack',
          options: () => ({
            title: 'Login',
            tabBarIcon: ({ color, size }) => (
              <Ionicons
                name='log-in'
                size={size}
                color={color}
                testID='login-tab-icon'
              />
            ),
          }),
        },
        RegisterTab: {
          stack: 'SignUpStack',
          options: () => ({
            title: 'Register',
            tabBarIcon: ({ color, size }) => (
              <Ionicons
                name='person-add'
                size={size}
                color={color}
                testID='register-tab-icon'
              />
            ),
          }),
        },
      },
      options: {
        tabBarActiveTintColor: themeColors.tabBarActiveTint,
        tabBarInactiveTintColor: themeColors.tabBarInactiveTint,
        tabBarStyle: {
          backgroundColor: themeColors.bgColor,
          borderTopWidth: 1,
          borderTopColor: themeColors.tabBarBorder,
        },
      },
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
