export const mockUser = {
  id: 1,
  username: 'johndoe',
  email: 'john.doe@example.com',
  bio: 'Full-stack developer passionate about React Native and mobile development.',
  image: 'https://i.pravatar.cc/300?img=1',
  following: false,
};

export const mockCurrentUser = {
  id: 1,
  username: 'johndoe',
  email: 'john.doe@example.com',
  bio: 'Full-stack developer passionate about React Native and mobile development.',
  image: 'https://i.pravatar.cc/300?img=1',
  token: 'mock-jwt-token-12345',
};

export const mockArticles = [
  {
    slug: 'how-to-build-webapps-that-scale',
    title: 'How to Build Web Apps That Scale',
    description: 'Building scalable web applications requires careful planning and architecture decisions.',
    body: 'In this comprehensive guide, we\'ll explore the key principles and best practices for building web applications that can handle growth and scale effectively...',
    tagList: ['webapps', 'scaling', 'architecture', 'performance'],
    createdAt: '2024-01-15T10:00:00.000Z',
    updatedAt: '2024-01-15T10:00:00.000Z',
    favorited: false,
    favoritesCount: 42,
    author: {
      username: 'techguru',
      bio: 'Senior Software Architect with 10+ years of experience',
      image: 'https://i.pravatar.cc/300?img=2',
      following: false,
    },
  },
  {
    slug: 'mobile-first-design-principles',
    title: 'Mobile-First Design Principles',
    description: 'Essential principles for designing mobile-first applications that provide excellent user experience.',
    body: 'Mobile-first design is not just about responsive layouts. It\'s about understanding user behavior on mobile devices and designing accordingly...',
    tagList: ['mobile', 'design', 'ux', 'responsive'],
    createdAt: '2024-01-14T15:30:00.000Z',
    updatedAt: '2024-01-14T15:30:00.000Z',
    favorited: true,
    favoritesCount: 27,
    author: {
      username: 'designpro',
      bio: 'UX Designer specializing in mobile experiences',
      image: 'https://i.pravatar.cc/300?img=3',
      following: true,
    },
  },
  {
    slug: 'react-native-performance-tips',
    title: 'React Native Performance Optimization Tips',
    description: 'Learn how to optimize your React Native app for better performance and user experience.',
    body: 'Performance optimization in React Native requires understanding both JavaScript and native platform specifics...',
    tagList: ['react-native', 'performance', 'optimization', 'mobile'],
    createdAt: '2024-01-13T09:15:00.000Z',
    updatedAt: '2024-01-13T09:15:00.000Z',
    favorited: false,
    favoritesCount: 18,
    author: {
      username: 'reactdev',
      bio: 'React Native developer and open source contributor',
      image: 'https://i.pravatar.cc/300?img=4',
      following: false,
    },
  },
];

export const mockComments = [
  {
    id: 1,
    createdAt: '2024-01-15T12:00:00.000Z',
    updatedAt: '2024-01-15T12:00:00.000Z',
    body: 'Great article! This really helped me understand the concepts better.',
    author: {
      username: 'reader1',
      bio: 'Learning web development',
      image: 'https://i.pravatar.cc/300?img=5',
      following: false,
    },
  },
  {
    id: 2,
    createdAt: '2024-01-15T14:30:00.000Z',
    updatedAt: '2024-01-15T14:30:00.000Z',
    body: 'Thanks for sharing your insights. Looking forward to more content like this!',
    author: {
      username: 'devstudent',
      bio: 'Full-stack developer in training',
      image: 'https://i.pravatar.cc/300?img=6',
      following: true,
    },
  },
];

export const mockTags = [
  'react',
  'react-native',
  'javascript',
  'typescript',
  'mobile',
  'web',
  'frontend',
  'backend',
  'fullstack',
  'design',
  'ux',
  'ui',
  'performance',
  'testing',
  'devops',
];

export const mockProfile = {
  username: 'johndoe',
  bio: 'Full-stack developer passionate about React Native and mobile development.',
  image: 'https://i.pravatar.cc/300?img=1',
  following: false,
};

// API Response wrappers
export const mockApiResponses = {
  // Authentication
  login: {
    user: mockCurrentUser,
  },
  
  register: {
    user: mockCurrentUser,
  },
  
  currentUser: {
    user: mockCurrentUser,
  },
  
  // Articles
  articles: {
    articles: mockArticles,
    articlesCount: mockArticles.length,
  },
  
  article: {
    article: mockArticles[0],
  },
  
  // Comments
  comments: {
    comments: mockComments,
  },
  
  // Profile
  profile: {
    profile: mockProfile,
  },
  
  // Tags
  tags: {
    tags: mockTags,
  },
  
  // Error responses
  validationError: {
    errors: {
      email: ['is required'],
      password: ['is required'],
    },
  },
  
  unauthorized: {
    errors: {
      message: 'Unauthorized',
    },
  },
  
  notFound: {
    errors: {
      message: 'Resource not found',
    },
  },
}; 