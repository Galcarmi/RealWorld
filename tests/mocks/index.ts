import './commonMocks';

export { getMockNavigationService } from './services';
export {
  getMockAuthStore,
  getMockUserStore,
  getMockArticlesStore,
} from './stores';
export { mockUser, mockUserMinimal, mockArticle, mockArticles } from './data';
export { getMockUseAuthorProfile } from './hooks';
export {
  setMockRoute,
  mockAuthorProfileRoute,
  setMockRouteParams,
} from './navigation';
