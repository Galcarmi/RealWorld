import { Profile, Article } from '../../src/services';
import { User } from '../../src/store/types';
import { MockApiResponse } from '../visual/config/puppeteerConfig';

// =============================================================================
// SHARED CONSTANTS - Common values used across mocks
// =============================================================================

const COMMON_VALUES = {
  dates: {
    default: '2024-01-01T00:00:00.000Z',
    secondary: '2024-01-02T00:00:00.000Z',
  },
  tokens: {
    default: 'mock-jwt-token',
    test: 'test-token',
  },
  users: {
    testUserId: '1',
    defaultUserId: '123',
  },
  images: {
    defaultAvatar: 'https://example.com/avatar.jpg',
    authorAvatar: 'https://example.com/author.jpg',
  },
} as const;

// Common author profiles to reuse
const COMMON_AUTHORS = {
  testuser1: {
    username: 'testuser1',
    bio: 'Author bio',
    image: null,
    following: false,
  },
  testuser2: {
    username: 'testuser2',
    bio: 'Another user bio',
    image: null,
    following: true,
  },
  testuser: {
    username: 'testuser',
    bio: 'Test bio',
    image: null,
    following: false,
  },
} as const;

// =============================================================================
// MOCK CREATORS - Basic functions to create mock data
// =============================================================================

export const createMockUser = (overrides: Partial<User> = {}): User => ({
  id: COMMON_VALUES.users.defaultUserId,
  email: 'test@example.com',
  username: 'testuser',
  bio: 'Test bio for user',
  image: COMMON_VALUES.images.defaultAvatar,
  token: COMMON_VALUES.tokens.test,
  ...overrides,
});

export const createMockAuthor = (
  overrides: Partial<Profile> = {}
): Profile => ({
  username: 'testauthor',
  bio: 'Test author bio',
  image: COMMON_VALUES.images.authorAvatar,
  following: false,
  ...overrides,
});

// Helper to create common authors
export const createCommonAuthor = (authorKey: keyof typeof COMMON_AUTHORS) =>
  createMockAuthor(COMMON_AUTHORS[authorKey]);

export const createMockArticle = (
  overrides: Partial<Article> = {}
): Article => ({
  slug: 'test-article-slug',
  title: 'Test Article Title',
  description: 'Test article description',
  body: 'Test article body content',
  tagList: ['test', 'article'],
  createdAt: COMMON_VALUES.dates.default,
  updatedAt: COMMON_VALUES.dates.default,
  favorited: false,
  favoritesCount: 0,
  author: createMockAuthor(),
  ...overrides,
});

export const createMockComment = (
  overrides: Partial<{
    id: number;
    body: string;
    createdAt: string;
    updatedAt: string;
    author: Profile;
  }> = {}
) => ({
  id: 1,
  body: 'This is a test comment',
  createdAt: COMMON_VALUES.dates.default,
  updatedAt: COMMON_VALUES.dates.default,
  author: createMockAuthor(),
  ...overrides,
});

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

// Helper for creating consistent authenticated user
export const createAuthenticatedUser = (overrides: Partial<User> = {}) =>
  createMockUser({
    id: COMMON_VALUES.users.testUserId,
    bio: 'Test bio',
    image: undefined,
    token: COMMON_VALUES.tokens.default,
    ...overrides,
  });

// =============================================================================
// BASIC MOCK INSTANCES - Commonly used mock data
// =============================================================================

export const mockUser = createMockUser();
export const mockUserMinimal = createMockUser({ bio: '', image: '' });
export const mockArticle = createMockArticle();

// Reusable authors
export const commonAuthors = {
  testuser1: createCommonAuthor('testuser1'),
  testuser2: createCommonAuthor('testuser2'),
  testuser: createCommonAuthor('testuser'),
};

export const mockArticles = [
  createMockArticle({
    slug: 'test-article-1',
    title: 'Test Article 1',
    description: 'This is a test article description',
    body: 'Test article body content',
    tagList: ['test', 'demo'],
    favoritesCount: 5,
    author: commonAuthors.testuser1,
  }),
  createMockArticle({
    slug: 'test-article-2',
    title: 'Test Article 2',
    description: 'Another test article',
    body: 'Another test article body',
    tagList: ['test', 'example'],
    createdAt: COMMON_VALUES.dates.secondary,
    updatedAt: COMMON_VALUES.dates.secondary,
    favorited: true,
    favoritesCount: 8,
    author: commonAuthors.testuser2,
  }),
];

export const mockComments = [
  createMockComment({
    id: 1,
    body: 'Great article! Thanks for sharing.',
    author: createMockAuthor({
      username: 'commenter1',
      bio: 'First commenter',
      image: null,
    }),
  }),
  createMockComment({
    id: 2,
    body: 'I disagree with some points but overall good read.',
    createdAt: COMMON_VALUES.dates.secondary,
    updatedAt: COMMON_VALUES.dates.secondary,
    author: createMockAuthor({
      username: 'commenter2',
      bio: 'Second commenter',
      image: null,
    }),
  }),
];

// =============================================================================
// API MOCKS - Organized by domain
// =============================================================================

// Common authenticated user response
const authenticatedUserResponse = {
  user: createAuthenticatedUser(),
};

export const authMocks = {
  login: {
    url: /node-express-conduit\.appspot\.com\/api\/users\/login$/,
    method: 'POST',
    status: 200,
    body: authenticatedUserResponse,
  },
  register: {
    url: /node-express-conduit\.appspot\.com\/api\/users$/,
    method: 'POST',
    status: 200,
    body: {
      user: createAuthenticatedUser({
        bio: undefined,
        image: undefined,
      }),
    },
  },
  getCurrentUser: {
    url: /node-express-conduit\.appspot\.com\/api\/user$/,
    method: 'GET',
    status: 200,
    body: authenticatedUserResponse,
  },
  updateUser: {
    url: /node-express-conduit\.appspot\.com\/api\/user$/,
    method: 'PUT',
    status: 200,
    body: {
      user: createAuthenticatedUser({
        email: 'updated@example.com',
        username: 'updateduser',
        bio: 'Updated bio',
        image: COMMON_VALUES.images.defaultAvatar,
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
          author: commonAuthors.testuser,
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
          author: commonAuthors.testuser1,
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
        author: commonAuthors.testuser,
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
      profile: commonAuthors.testuser1,
    },
  },
  followAuthor: {
    url: /node-express-conduit\.appspot\.com\/api\/profiles\/testuser1\/follow$/,
    method: 'POST',
    status: 200,
    body: {
      profile: {
        ...commonAuthors.testuser1,
        following: true,
      },
    },
  },
} as const;

// =============================================================================
// VISUAL TEST MOCKS - For visual regression testing
// =============================================================================

export const visualTestMocks = {
  article: createMockArticle({
    slug: 'visual-test-article',
    title: 'Visual Test Article',
    description: 'This is a test article for visual testing',
    body: 'This is the main content of the test article. It contains enough text to demonstrate how the article screen looks when displaying content.',
    tagList: ['visual', 'test', 'demo'],
    favoritesCount: 3,
    author: createMockAuthor({
      username: 'visualtestauthor',
      bio: 'Author for visual test',
      image: null,
    }),
  }),
  comment: createMockComment({
    id: 1,
    body: 'This is a test comment for the visual test. It demonstrates how comments appear on the article screen.',
    author: createMockAuthor({
      username: 'testcommenter',
      bio: 'Test commenter for visual tests',
      image: null,
    }),
  }),
} as const;

export const visualTestApiMocks = {
  homeArticles: {
    url: /node-express-conduit\.appspot\.com\/api\/articles(\?.*)?$/,
    method: 'GET',
    status: 200,
    body: {
      articles: [visualTestMocks.article],
      articlesCount: 1,
    },
  } as MockApiResponse,
  individualArticle: {
    url: /node-express-conduit\.appspot\.com\/api\/articles\/visual-test-article$/,
    method: 'GET',
    status: 200,
    body: {
      article: visualTestMocks.article,
    },
  } as MockApiResponse,
  articleComments: {
    url: /node-express-conduit\.appspot\.com\/api\/articles\/visual-test-article\/comments$/,
    method: 'GET',
    status: 200,
    body: {
      comments: [visualTestMocks.comment],
    },
  } as MockApiResponse,
} as const;

// Visual test configurations for different screen types
export interface VisualTestMockConfig {
  url: RegExp;
  method: string;
  status: number;
  contentType: string;
  body: Record<string, any>;
  delay: number;
}

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

// =============================================================================
// SPECIALIZED TEST MOCKS
// =============================================================================

// Article Screen Test Specific Mocks
export const articleScreenTestMocks = {
  article: createMockArticle({
    slug: 'test-article-slug',
    title: 'Test Article Title',
    body: 'This is the test article body content.',
    author: createMockAuthor({ username: 'testauthor' }),
  }),
  comments: [
    createMockComment({
      id: 1,
      body: 'Great article! Thanks for sharing.',
      author: createMockAuthor({ username: 'commenter1' }),
    }),
    createMockComment({
      id: 2,
      body: 'I disagree with some points but overall good read.',
      author: createMockAuthor({ username: 'commenter2' }),
    }),
  ],
  newComment: createMockComment({
    body: 'New test comment',
    id: 3,
  }),
  route: {
    key: 'Article',
    name: 'Article' as const,
    params: { slug: 'test-article-slug' },
  },
};

export const articleScreenVisualMocks: MockApiResponse[] = [
  authMocks.login,
  authMocks.getCurrentUser,
  visualTestApiMocks.homeArticles,
  visualTestApiMocks.individualArticle,
  visualTestApiMocks.articleComments,
];

// =============================================================================
// MOCK COLLECTION HELPERS
// =============================================================================

// Common auth pattern used in most collections
const getBaseAuthMocks = (): MockApiResponse[] => [
  authMocks.login,
  authMocks.getCurrentUser,
];

export const mockCollections: Record<string, MockApiResponse[]> = {
  auth: getBaseAuthMocks(),
  authWithRegistration: [authMocks.register],
  basicApp: [
    ...getBaseAuthMocks(),
    articleMocks.getArticles,
    articleMocks.getUserArticlesEmpty,
  ],
  authorProfile: [
    ...getBaseAuthMocks(),
    articleMocks.getArticles,
    profileMocks.getAuthorProfile,
    articleMocks.getAuthorArticles,
    profileMocks.followAuthor,
  ],
  favorites: [
    ...getBaseAuthMocks(),
    articleMocks.getArticles,
    articleMocks.getFavoriteArticles,
    articleMocks.favoriteArticle1,
    articleMocks.unfavoriteArticle2,
  ],
  userProfile: [
    ...getBaseAuthMocks(),
    articleMocks.getArticles,
    articleMocks.getUserArticles,
  ],
  editProfile: [
    ...getBaseAuthMocks(),
    authMocks.updateUser,
    articleMocks.getUserArticlesEmpty,
  ],
  newArticle: [
    ...getBaseAuthMocks(),
    articleMocks.createArticle,
    articleMocks.getUserArticlesEmpty,
    articleMocks.getArticles,
    profileMocks.getAuthorProfile,
    articleMocks.getAuthorArticles,
  ],
  completeIntegration: [
    ...getBaseAuthMocks(),
    articleMocks.getArticles,
    profileMocks.getAuthorProfile,
    articleMocks.getAuthorArticles,
    articleMocks.favoriteArticle1,
    articleMocks.unfavoriteArticle2,
    articleMocks.getUserArticlesEmpty,
    articleMocks.createArticle,
  ],
  articleScreenVisual: [
    ...getBaseAuthMocks(),
    visualTestApiMocks.homeArticles,
    visualTestApiMocks.individualArticle,
    visualTestApiMocks.articleComments,
  ],
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
  ],
} as const;

export const visualTestMockCollections = {
  homeScreen: homeScreenVisualMocks,
  articleScreen: articleScreenVisualMocks,
  emptyMocks: [] as VisualTestMockConfig[],
} as const;
