// Mock user data
export const mockUser = {
  id: '123',
  email: 'test@example.com',
  username: 'testuser',
  bio: 'Test bio for user',
  image: 'https://example.com/image.jpg',
  token: 'test-token',
};

// Mock user variations
export const mockUserMinimal = {
  id: '123',
  email: 'test@example.com',
  username: 'testuser',
  bio: '',
  image: '',
  token: 'test-token',
};

// Mock single article
export const mockArticle = {
  slug: 'test-article-slug',
  title: 'Test Article Title',
  description: 'Test article description',
  body: 'Test article body content',
  tagList: ['test', 'article'],
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  favorited: false,
  favoritesCount: 0,
  author: {
    username: 'testauthor',
    bio: 'Test author bio',
    image: 'https://example.com/author.jpg',
    following: false,
  },
};

// Mock article data
export const mockArticles = [
  {
    slug: 'test-article-1',
    title: 'Test Article 1',
    description: 'Description 1',
    body: 'Body 1',
    tagList: ['tag1'],
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    favorited: false,
    favoritesCount: 0,
    author: {
      username: 'testuser1',
      bio: 'Test bio',
      image: 'test-image.jpg',
      following: false,
    },
  },
  {
    slug: 'test-article-2',
    title: 'Test Article 2',
    description: 'Description 2',
    body: 'Body 2',
    tagList: ['tag2'],
    createdAt: '2024-01-02T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z',
    favorited: true,
    favoritesCount: 5,
    author: {
      username: 'testuser2',
      bio: 'Test bio 2',
      image: 'test-image2.jpg',
      following: true,
    },
  },
];

// Mock API responses
export const mockApiResponse = {
  user: mockUser,
  message: 'Success',
};

// Mock API errors
export const mockApiError = {
  status: 400,
  data: {
    errors: {
      email: ['is invalid'],
      password: ['is too short'],
    },
  },
};

// Visual Test Mock API Configurations
export interface VisualTestMockConfig {
  url: RegExp;
  method: string;
  status: number;
  contentType: string;
  body: Record<string, any>;
  delay: number;
}

// Home Screen Visual Test Mocks - using consistent test data
export const homeScreenVisualMocks: VisualTestMockConfig[] = [
  {
    url: /node-express-conduit\.appspot\.com\/api\/articles(\?.*)?$/,
    method: 'GET',
    status: 200,
    contentType: 'application/json',
    body: {
      articles: [
        {
          slug: 'test-article-1',
          title: 'Test Article 1',
          description: 'This is a test article description',
          body: 'Test article body content',
          tagList: ['test', 'demo'],
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
          favorited: false,
          favoritesCount: 5,
          author: {
            username: 'authoruser',
            bio: 'Author bio',
            image: null,
            following: false,
          },
        },
        {
          slug: 'test-article-2',
          title: 'Test Article 2',
          description: 'Another test article',
          body: 'Another test article body',
          tagList: ['test', 'example'],
          createdAt: '2024-01-02T00:00:00.000Z',
          updatedAt: '2024-01-02T00:00:00.000Z',
          favorited: true,
          favoritesCount: 8,
          author: {
            username: 'anotheruser',
            bio: 'Another user bio',
            image: null,
            following: true,
          },
        },
      ],
      articlesCount: 2,
    },
    delay: 500,
  },
  {
    url: /node-express-conduit\.appspot\.com\/api\/articles\/feed(\?.*)?$/,
    method: 'GET',
    status: 200,
    contentType: 'application/json',
    body: {
      articles: [
        {
          slug: 'test-article-1',
          title: 'Test Article 1',
          description: 'This is a test article description',
          body: 'Test article body content',
          tagList: ['test', 'demo'],
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
          favorited: false,
          favoritesCount: 5,
          author: {
            username: 'authoruser',
            bio: 'Author bio',
            image: null,
            following: false,
          },
        },
        {
          slug: 'test-article-2',
          title: 'Test Article 2',
          description: 'Another test article',
          body: 'Another test article body',
          tagList: ['test', 'example'],
          createdAt: '2024-01-02T00:00:00.000Z',
          updatedAt: '2024-01-02T00:00:00.000Z',
          favorited: true,
          favoritesCount: 8,
          author: {
            username: 'anotheruser',
            bio: 'Another user bio',
            image: null,
            following: true,
          },
        },
      ],
      articlesCount: 2,
    },
    delay: 500,
  },
];

// Visual Test Mock Collections
export const visualTestMockCollections = {
  homeScreen: homeScreenVisualMocks,
  emptyMocks: [] as VisualTestMockConfig[],
} as const;
