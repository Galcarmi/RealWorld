# RealWorld React Native App

A React Native implementation of the [RealWorld](https://github.com/gothinkster/realworld) exemplary fullstack application. This project serves as a comprehensive learning resource for React Native development, demonstrating real-world patterns and best practices.

## 🎯 Purpose

This project is designed to teach React Native skills through a practical, full-featured application. Unlike simple todo apps, RealWorld provides the complexity and depth needed to understand how to build production-ready mobile applications.

## ✨ Features

- **Authentication System**: Login, registration, and user management
- **Article Management**: Create, read, update, and delete articles
- **Social Features**: Follow users, favorite articles, and commenting
- **Profile Management**: User profiles with customizable settings
- **Real-time Updates**: Dynamic content loading and state management
- **Responsive Design**: Optimized for both iOS and Android platforms

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Yarn](https://yarnpkg.com/) (v3.8.6 or higher)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- iOS Simulator (for iOS development) or Android Emulator (for Android development)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repository-url>
   cd RealWorld
   ```

2. **Install dependencies:**
   ```bash
   yarn install
   ```

3. **Start the development server:**
   ```bash
   yarn start
   ```

### Running the App

- **iOS Simulator:**
  ```bash
  yarn ios
  ```

- **Android Emulator:**
  ```bash
  yarn android
  ```

- **Web Browser:**
  ```bash
  yarn web
  ```

- **On Physical Device:**
  - Install the Expo Go app on your device
  - Scan the QR code displayed in the terminal

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
├── constants/          # App constants and configuration
├── hooks/             # Custom React hooks
├── locales/           # Internationalization files
├── navigation/        # Navigation configuration
├── screens/           # Screen components
├── services/          # API services and external integrations
├── store/             # State management (MobX stores)
├── theme/             # Theme configuration and styling
├── types/             # TypeScript type definitions
└── utils/             # Utility functions

tests/
├── integration/       # Integration tests
├── mocks/            # Test mocks and fixtures
├── unit/             # Unit tests
└── visual/           # Visual regression tests
```

## 🛠️ Technologies & Tools

### Core Technologies
- **[React Native](https://reactnative.dev/)** (0.79.4) - Mobile app framework
- **[Expo](https://expo.dev/)** (~53.0.9) - Development platform and toolchain
- **[TypeScript](https://www.typescriptlang.org/)** (~5.8.3) - Type safety and developer experience

### State Management
- **[MobX](https://mobx.js.org/)** (~6.13.7) - Reactive state management
- **[MobX React](https://github.com/mobxjs/mobx-react)** (~9.2.0) - React bindings for MobX

### Navigation
- **[React Navigation](https://reactnavigation.org/)** (~6.0.13) - Navigation library
- **[rn-navio](https://github.com/kanzitelli/rn-navio)** - Navigation state management

### UI & Styling
- **[React Native UI Lib](https://wix.github.io/react-native-ui-lib/)** (~7.43.0) - UI component library
- **[React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)** (~3.17.4) - Animations
- **[React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/)** (~2.24.0) - Touch interactions

### Data & Networking
- **[Axios](https://axios-http.com/)** (~1.9.0) - HTTP client
- **[AsyncStorage](https://react-native-async-storage.github.io/async-storage/)** - Local data persistence

### Internationalization
- **[i18next](https://www.i18next.com/)** (~25.2.1) - Internationalization framework
- **[react-i18next](https://react.i18next.com/)** (~15.5.3) - React bindings for i18next

### Development Tools
- **[ESLint](https://eslint.org/)** - Code linting
- **[Prettier](https://prettier.io/)** - Code formatting
- **[Husky](https://typicode.github.io/husky/)** - Git hooks
- **[TypeScript](https://www.typescriptlang.org/)** - Static typing

### Testing Framework
- **[Jest](https://jestjs.io/)** (~29.7.0) - Testing framework
- **[Testing Library](https://testing-library.com/)** - Component testing utilities
- **[Puppeteer](https://pptr.dev/)** - Visual regression testing

## 🧪 Testing

The project includes comprehensive testing setup:

### Running Tests

```bash
# Run all tests
yarn test

# Run unit tests
yarn test:unit

# Run integration tests  
yarn test:integration

# Run visual regression tests
yarn test:visual

# Run visual tests in Docker
yarn test:visual:docker
```

### Test Types

- **Unit Tests**: Component and utility function testing
- **Integration Tests**: Screen and flow testing
- **Visual Tests**: UI consistency and regression testing

## 📱 Available Scripts

```bash
# Development
yarn start                    # Start Expo development server
yarn ios                      # Run on iOS simulator
yarn android                  # Run on Android emulator
yarn web                      # Run in web browser

# Code Quality
yarn lint                     # Run ESLint
yarn lint:fix                # Fix ESLint errors
yarn format                  # Format code with Prettier
yarn format:check            # Check code formatting
yarn type-check              # Run TypeScript type checking
yarn code-quality            # Run all code quality checks

# Testing
yarn test                     # Run all tests
yarn test:unit               # Run unit tests
yarn test:integration       # Run integration tests
yarn test:visual             # Run visual tests
yarn test:visual:docker      # Run visual tests in Docker
```

## 🏛️ Architecture Patterns

### State Management
The app uses **MobX** for state management with the following stores:
- `userStore` - User authentication and profile management
- `articlesStore` - Article data and operations
- `authStore` - Authentication state and operations
- `languageStore` - Internationalization settings

### Navigation
Navigation is handled using **React Navigation** with **rn-navio** for enhanced state management:
- Tab-based navigation for main app sections
- Stack navigation for screen transitions
- Authentication-aware routing

### Component Architecture
- **Screen Components**: Full-screen containers that manage data and state
- **Reusable Components**: Shared UI components with consistent styling
- **Custom Hooks**: Reusable logic for common operations

## 🌐 API Integration

The app integrates with the RealWorld API specification:
- User authentication and registration
- Article CRUD operations
- User profiles and following
- Comments and favoriting
- Tag-based filtering

## 🎨 Theming & Styling

- Consistent design system with predefined colors and typography
- Custom fonts (WixMadeFor family)
- Responsive design for different screen sizes
- Dark/light theme support infrastructure

## 🚀 Deployment

The project is configured for deployment using Expo's build service:
- iOS builds using Expo Application Services (EAS)
- Android builds with automatic signing
- Web deployment support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📚 Learning Resources

This project demonstrates the following React Native concepts:
- Component lifecycle and hooks
- State management with MobX
- Navigation patterns
- API integration and data fetching
- Form handling and validation
- Testing strategies
- Performance optimization
- Code organization and architecture

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🔗 Related Links

- [RealWorld Project](https://github.com/gothinkster/realworld) - The parent project
- [RealWorld API Spec](https://realworld-docs.netlify.app/) - API documentation
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Expo Documentation](https://docs.expo.dev/)

## 🌐 API & Design References

### Swagger API
This application uses the RealWorld API hosted at:
- **[Swagger API Documentation](https://node-express-conduit.appspot.com/)** - Complete API reference and testing interface

### Design Reference
The UI design is based on the following Figma mockup:
- **[Figma Design](https://www.figma.com/design/oDDztENWIXmbeR82VEWCwS/Realworld-Blog-Application?node-id=5-2845&t=ISWKdfHBCixWF5vi-0)** - RealWorld Blog Application design

*Note: This is not my original design, but I've made every effort to stay faithful to the Figma specifications while adapting it for React Native mobile interfaces.*

---

**Happy coding! 🚀** 