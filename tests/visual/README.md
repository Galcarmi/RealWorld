# Visual Tests

This directory contains the visual regression tests for the RealWorld React Native app.

## Directory Structure

```
tests/visual/
├── config/           # Test configuration and helpers
├── screens/          # Screen-specific visual tests
├── utils/            # Test utilities and helpers
├── screenshots/      # Generated test screenshots (gitignored)
└── baselines/        # Baseline screenshots for comparison (gitignored)
```

## Running Visual Tests

```bash
# Run all visual tests
npm run test:visual

# Run tests in interactive mode (local development)
npm run test:visual:dev

# Run tests in headless mode (CI)
npm run test:visual:headless
```

## Screenshot Management

- **screenshots/**: Contains current test run screenshots
- **baselines/**: Contains baseline screenshots for comparison
- Both directories are gitignored and managed automatically by CI/CD

## Adding New Visual Tests

Use the `createVisualTestSuite` helper to create consistent visual tests:

```typescript
import { createVisualTestSuite } from '../utils/testHelpers';

createVisualTestSuite('Screen Name', {
  // optional config overrides
}, (suite) => {
  it('should match baseline', async () => {
    const testHelper = suite.getTestHelper();
    await testHelper.navigateTo('/screen-path');
    await testHelper.takeScreenshot('screen-baseline');
  });
});
```

## Test Utilities

- **PuppeteerTestHelper**: Main test automation class
- **commonTestActions**: Reusable test actions
- **mockData**: API mock data for testing
- **testSetup**: Directory and environment setup utilities 