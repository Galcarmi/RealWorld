import { Profile, Article } from '../../src/services';
import { User } from '../../src/store/types';
import { MockApiResponse } from '../visual/config/puppeteerConfig';

export const createMockUser = (overrides: Partial<User> = {}): User => ({
  id: '123',
  email: 'test@example.com',
  username: 'testuser',
  bio: 'Test bio for user',
  image: 'https://example.com/avatar.jpg',
  token: 'test-token',
  ...overrides,
});

export const createMockAuthor = (
  overrides: Partial<Profile> = {}
): Profile => ({
  username: 'testauthor',
  bio: 'Test author bio',
  image: 'https://example.com/author.jpg',
  following: false,
  ...overrides,
});

export const createMockArticle = (
  overrides: Partial<Article> = {}
): Article => ({
  slug: 'test-article-slug',
  title: 'Test Article Title',
  description: 'Test article description',
  body: 'Test article body content',
  tagList: ['test', 'article'],
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  favorited: false,
  favoritesCount: 0,
  author: createMockAuthor(),
  ...overrides,
});

export const mockUser = createMockUser();
export const mockUserMinimal = createMockUser({ bio: '', image: '' });
export const mockArticle = createMockArticle();

export const mockArticles = [
  createMockArticle({
    slug: 'test-article-1',
    title: 'Test Article 1',
    description: 'This is a test article description',
    body: 'Test article body content',
    tagList: ['test', 'demo'],
    favoritesCount: 5,
    author: createMockAuthor({
      username: 'testuser1',
      bio: 'Author bio',
      image: null,
    }),
  }),
  createMockArticle({
    slug: 'test-article-2',
    title: 'Test Article 2',
    description: 'Another test article',
    body: 'Another test article body',
    tagList: ['test', 'example'],
    createdAt: '2024-01-02T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z',
    favorited: true,
    favoritesCount: 8,
    author: createMockAuthor({
      username: 'testuser2',
      bio: 'Another user bio',
      image: null,
      following: true,
    }),
  }),
];

export const createMockApiResponse = (
  overrides: Partial<{ user: User; message: string }> = {}
) => ({
  user: createMockUser(),
  message: 'Success',
  ...overrides,
});

export const createMockApiError = (errors: Record<string, string[]> = {}) => ({
  status: 400,
  data: {
    errors: {
      email: ['is invalid'],
      password: ['is too short'],
      ...errors,
    },
  },
});

export interface VisualTestMockConfig {
  url: RegExp;
  method: string;
  status: number;
  contentType: string;
  body: Record<string, any>;
  delay: number;
}

export const authMocks = {
  login: {
    url: /node-express-conduit\.appspot\.com\/api\/users\/login$/,
    method: 'POST',
    status: 200,
    body: {
      user: createMockUser({
        id: '1',
        bio: 'Test bio',
        image: undefined,
        token: 'mock-jwt-token',
      }),
    },
  },
  register: {
    url: /node-express-conduit\.appspot\.com\/api\/users$/,
    method: 'POST',
    status: 200,
    body: {
      user: createMockUser({
        id: '1',
        bio: undefined,
        image: undefined,
        token: 'mock-jwt-token',
      }),
    },
  },
  getCurrentUser: {
    url: /node-express-conduit\.appspot\.com\/api\/user$/,
    method: 'GET',
    status: 200,
    body: {
      user: createMockUser({
        id: '1',
        bio: 'Test bio',
        image: undefined,
        token: 'mock-jwt-token',
      }),
    },
  },
  updateUser: {
    url: /node-express-conduit\.appspot\.com\/api\/user$/,
    method: 'PUT',
    status: 200,
    body: {
      user: createMockUser({
        id: '1',
        email: 'updated@example.com',
        username: 'updateduser',
        bio: 'Updated bio',
        image: 'https://example.com/avatar.jpg',
        token: 'mock-jwt-token',
      }),
    },
  },
} as const;

export const articleMocks = {
  getArticles: {
    url: /node-express-conduit\.appspot\.com\/api\/articles\?/,
    method: 'GET',
    status: 200,
    body: {
      articles: mockArticles,
      articlesCount: mockArticles.length,
    },
  },
  getFavoriteArticles: {
    url: /node-express-conduit\.appspot\.com\/api\/articles\?favorited=/,
    method: 'GET',
    status: 200,
    body: {
      articles: [mockArticles[1]],
      articlesCount: 1,
    },
  },
  getUserArticles: {
    url: /node-express-conduit\.appspot\.com\/api\/articles\?author=testuser/,
    method: 'GET',
    status: 200,
    body: {
      articles: [
        createMockArticle({
          slug: 'my-article-1',
          title: 'My First Article',
          description: 'This is my first article',
          body: 'Article content here',
          tagList: ['personal', 'first'],
          favoritesCount: 2,
          author: createMockAuthor({
            username: 'testuser',
            bio: 'Test bio',
            image: null,
          }),
        }),
      ],
      articlesCount: 1,
    },
  },
  getUserArticlesEmpty: {
    url: /node-express-conduit\.appspot\.com\/api\/articles\?author=testuser/,
    method: 'GET',
    status: 200,
    body: {
      articles: [],
      articlesCount: 0,
    },
  },
  getAuthorArticles: {
    url: /node-express-conduit\.appspot\.com\/api\/articles\?author=testuser1/,
    method: 'GET',
    status: 200,
    body: {
      articles: [
        createMockArticle({
          slug: 'author-article-1',
          title: 'Author Article 1',
          description: 'Article by the author',
          body: 'Author article content',
          tagList: ['author', 'content'],
          favoritesCount: 3,
          author: createMockAuthor({
            username: 'testuser1',
            bio: 'Author bio',
            image: null,
          }),
        }),
      ],
      articlesCount: 1,
    },
  },
  createArticle: {
    url: /node-express-conduit\.appspot\.com\/api\/articles$/,
    method: 'POST',
    status: 200,
    body: {
      article: createMockArticle({
        slug: 'new-test-article',
        title: 'New Test Article',
        description: 'This is a new test article',
        body: 'Article body content here',
        tagList: ['new', 'test'],
        favoritesCount: 0,
        author: createMockAuthor({
          username: 'testuser',
          bio: 'Test bio',
          image: null,
        }),
      }),
    },
  },
  favoriteArticle1: {
    url: /node-express-conduit\.appspot\.com\/api\/articles\/test-article-1\/favorite$/,
    method: 'POST',
    status: 200,
    body: {
      article: {
        ...mockArticles[0],
        favorited: true,
        favoritesCount: 6,
      },
    },
  },
  unfavoriteArticle2: {
    url: /node-express-conduit\.appspot\.com\/api\/articles\/test-article-2\/favorite$/,
    method: 'DELETE',
    status: 200,
    body: {
      article: {
        ...mockArticles[1],
        favorited: false,
        favoritesCount: 7,
      },
    },
  },
} as const;

export const profileMocks = {
  getAuthorProfile: {
    url: /node-express-conduit\.appspot\.com\/api\/profiles\/testuser1$/,
    method: 'GET',
    status: 200,
    body: {
      profile: createMockAuthor({
        username: 'testuser1',
        bio: 'Author bio',
        image: null,
      }),
    },
  },
  followAuthor: {
    url: /node-express-conduit\.appspot\.com\/api\/profiles\/testuser1\/follow$/,
    method: 'POST',
    status: 200,
    body: {
      profile: createMockAuthor({
        username: 'testuser1',
        bio: 'Author bio',
        image: null,
        following: true,
      }),
    },
  },
} as const;

export const homeScreenVisualMocks: VisualTestMockConfig[] = [
  {
    url: /node-express-conduit\.appspot\.com\/api\/articles(\?.*)?$/,
    method: 'GET',
    status: 200,
    contentType: 'application/json',
    body: {
      articles: mockArticles,
      articlesCount: mockArticles.length,
    },
    delay: 500,
  },
  {
    url: /node-express-conduit\.appspot\.com\/api\/articles\/feed(\?.*)?$/,
    method: 'GET',
    status: 200,
    contentType: 'application/json',
    body: {
      articles: mockArticles,
      articlesCount: mockArticles.length,
    },
    delay: 500,
  },
];

export const mockCollections = {
  auth: [authMocks.login, authMocks.getCurrentUser] as MockApiResponse[],
  authWithRegistration: [authMocks.register] as MockApiResponse[],
  basicApp: [
    authMocks.login,
    authMocks.getCurrentUser,
    articleMocks.getArticles,
    articleMocks.getUserArticlesEmpty,
  ] as MockApiResponse[],
  authorProfile: [
    authMocks.login,
    authMocks.getCurrentUser,
    articleMocks.getArticles,
    profileMocks.getAuthorProfile,
    articleMocks.getAuthorArticles,
    profileMocks.followAuthor,
  ] as MockApiResponse[],
  favorites: [
    authMocks.login,
    authMocks.getCurrentUser,
    articleMocks.getArticles,
    articleMocks.getFavoriteArticles,
    articleMocks.favoriteArticle1,
    articleMocks.unfavoriteArticle2,
  ] as MockApiResponse[],
  userProfile: [
    authMocks.login,
    authMocks.getCurrentUser,
    articleMocks.getArticles,
    articleMocks.getUserArticles,
  ] as MockApiResponse[],
  editProfile: [
    authMocks.login,
    authMocks.getCurrentUser,
    authMocks.updateUser,
    articleMocks.getUserArticlesEmpty,
  ] as MockApiResponse[],
  newArticle: [
    authMocks.login,
    authMocks.getCurrentUser,
    articleMocks.createArticle,
    articleMocks.getUserArticlesEmpty,
    articleMocks.getArticles,
    profileMocks.getAuthorProfile,
    articleMocks.getAuthorArticles,
  ] as MockApiResponse[],
  completeIntegration: [
    authMocks.login,
    authMocks.getCurrentUser,
    articleMocks.getArticles,
    profileMocks.getAuthorProfile,
    articleMocks.getAuthorArticles,
    articleMocks.favoriteArticle1,
    articleMocks.unfavoriteArticle2,
    articleMocks.getUserArticlesEmpty,
    articleMocks.createArticle,
  ] as MockApiResponse[],
  allMocks: [
    authMocks.login,
    authMocks.register,
    authMocks.getCurrentUser,
    authMocks.updateUser,
    articleMocks.getArticles,
    articleMocks.getFavoriteArticles,
    articleMocks.getUserArticles,
    articleMocks.getUserArticlesEmpty,
    articleMocks.getAuthorArticles,
    articleMocks.createArticle,
    articleMocks.favoriteArticle1,
    articleMocks.unfavoriteArticle2,
    profileMocks.getAuthorProfile,
    profileMocks.followAuthor,
  ] as MockApiResponse[],
} as const;

export const visualTestMockCollections = {
  homeScreen: homeScreenVisualMocks,
  emptyMocks: [] as VisualTestMockConfig[],
} as const;
