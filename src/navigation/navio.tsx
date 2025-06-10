import { Ionicons } from '@expo/vector-icons';
import { Navio } from 'rn-navio';

import { FavoritesScreen } from '../screens/favoritesScreen/favoritesScreen';
import { HomeScreen } from '../screens/homeScreen/homeScreen';
import { LoginScreen as SignInScreen } from '../screens/login/loginScreen';
import { Main as SignUpScreen } from '../screens/login/signUpScreen';
import { ProfileScreen } from '../screens/profileScreen/profileScreen';
import { navigationService } from '../services/navigationService';
import { themeColors } from '../theme/colors';

const navio = Navio.build({
  screens: {
    Login: SignUpScreen,
    SignIn: SignInScreen,
    Home: HomeScreen,
    Favorites: FavoritesScreen,
    Profile: ProfileScreen,
  },
  stacks: {
    AuthStack: ['Login', 'SignIn'],
    HomeStack: ['Home'],
    FavoritesStack: ['Favorites'],
    ProfileStack: ['Profile'],
    SignInStack: ['SignIn'],
    RegisterStack: ['Login'],
  },
  tabs: {
    MainTabs: {
      layout: {
        HomeTab: {
          stack: 'HomeStack',
          options: () => ({
            title: 'Home',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name='home' size={size} color={color} />
            ),
          }),
        },
        FavoritesTab: {
          stack: 'FavoritesStack',
          options: () => ({
            title: 'Favorites',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name='heart' size={size} color={color} />
            ),
          }),
        },
        ProfileTab: {
          stack: 'ProfileStack',
          options: () => ({
            title: 'Profile',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name='person' size={size} color={color} />
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
              <Ionicons name='home' size={size} color={color} />
            ),
          }),
        },
        LoginTab: {
          stack: 'SignInStack',
          options: () => ({
            title: 'Login',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name='log-in' size={size} color={color} />
            ),
          }),
        },
        RegisterTab: {
          stack: 'RegisterStack',
          options: () => ({
            title: 'Register',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name='person-add' size={size} color={color} />
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
