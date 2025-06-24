import { StackScreenOptions } from 'rn-navio/dist/types';

import { Ionicons } from '@expo/vector-icons';

import { Navio } from 'rn-navio';

import { COLORS } from '../constants/styles';
import { ArticleScreen } from '../screens/article/articleScreen';
import { AuthorProfileScreen } from '../screens/authorProfile/authorProfileScreen';
import { EditProfileScreen } from '../screens/editProfile/editProfileScreen';
import { FavoritesScreen } from '../screens/favoritesScreen/favoritesScreen';
import { HomeScreen } from '../screens/homeScreen/homeScreen';
import { SignInScreen } from '../screens/login/signInScreen';
import { SignUpScreen } from '../screens/login/signUpScreen';
import { NewArticleScreen } from '../screens/newArticle/newArticleScreen';
import { ProfileScreen } from '../screens/profileScreen/profileScreen';
import { navigationService } from '../services/navigation/NavigationService';

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
  tabBarActiveTintColor: COLORS.TAB_BAR_ACTIVE_TINT,
  tabBarInactiveTintColor: COLORS.TAB_BAR_INACTIVE_TINT,
  tabBarStyle: {
    backgroundColor: COLORS.BACKGROUND,
    borderTopWidth: 1,
    borderTopColor: COLORS.TAB_BAR_BORDER,
  },
});

const headerOptions: StackScreenOptions = {
  headerShown: true,
  headerTitle: '',
  headerStyle: {
    backgroundColor: COLORS.PRIMARY,
  },
  headerTintColor: COLORS.BACKGROUND,
  headerTitleStyle: {
    fontWeight: 'bold',
  },
};

const navio = Navio.build({
  screens: {
    SignUp: {
      component: SignUpScreen,
      options: () => ({
        headerShown: false,
      }),
    },
    SignIn: {
      component: SignInScreen,
      options: () => ({
        headerShown: false,
      }),
    },
    Home: {
      component: HomeScreen,
      options: () => ({
        ...headerOptions,
      }),
    },
    Favorites: {
      component: FavoritesScreen,
      options: () => ({
        ...headerOptions,
      }),
    },
    Profile: {
      component: ProfileScreen,
      options: () => ({
        ...headerOptions,
      }),
    },
    EditProfile: {
      component: EditProfileScreen,
      options: () => ({
        ...headerOptions,
      }),
    },
    AuthorProfile: {
      component: AuthorProfileScreen,
      options: () => ({
        ...headerOptions,
      }),
    },
    NewArticle: {
      component: NewArticleScreen,
      options: () => ({
        ...headerOptions,
      }),
    },
    Article: {
      component: ArticleScreen,
      options: () => ({
        ...headerOptions,
      }),
    },
  },
  stacks: {
    HomeStack: ['Home', 'AuthorProfile', 'Favorites', 'Article'],
    FavoritesStack: ['Favorites', 'AuthorProfile', 'Article'],
    ProfileStack: [
      'Profile',
      'EditProfile',
      'NewArticle',
      'AuthorProfile',
      'Article',
    ],
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
        headerShown: true,
        headerStyle: {
          backgroundColor: COLORS.PRIMARY,
        },
        headerTintColor: COLORS.BACKGROUND,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerBackTitleVisible: false,
      },
    },
  },
  root: 'tabs.AuthTabs',
});

navigationService.setNavioInstance(navio);

export { navio };
export type NavioInstance = typeof navio;
