import { FeedType } from '../../../src/constants/feedTypes';

const getEmptyFeedMessage = (
  feedType: FeedType,
  isAuthenticated: boolean
): string => {
  if (!isAuthenticated) {
    return 'Sign in to see personalized content';
  }

  switch (feedType) {
    case FeedType.GLOBAL:
      return 'No articles available';
    case FeedType.FEED:
      return 'Follow some users to see their articles here';
    default:
      return 'No content available';
  }
};

const shouldShowFeedTabs = (isAuthenticated: boolean): boolean => {
  return isAuthenticated;
};

const getNextFeedType = (currentFeedType: FeedType): FeedType => {
  return currentFeedType === FeedType.GLOBAL ? FeedType.FEED : FeedType.GLOBAL;
};

describe('Feed State Helpers', () => {
  describe('getEmptyFeedMessage', () => {
    describe('for unauthenticated users', () => {
      it('returns sign-in message regardless of feed type', () => {
        expect(getEmptyFeedMessage(FeedType.GLOBAL, false)).toBe(
          'Sign in to see personalized content'
        );
        expect(getEmptyFeedMessage(FeedType.FEED, false)).toBe(
          'Sign in to see personalized content'
        );
      });
    });

    describe('for authenticated users', () => {
      it('returns global feed message for global feed', () => {
        expect(getEmptyFeedMessage(FeedType.GLOBAL, true)).toBe(
          'No articles available'
        );
      });

      it('returns user feed message for user feed', () => {
        expect(getEmptyFeedMessage(FeedType.FEED, true)).toBe(
          'Follow some users to see their articles here'
        );
      });

      it('returns default message for unknown feed type', () => {
        expect(getEmptyFeedMessage('UNKNOWN' as FeedType, true)).toBe(
          'No content available'
        );
      });
    });
  });

  describe('shouldShowFeedTabs', () => {
    it('returns true for authenticated users', () => {
      expect(shouldShowFeedTabs(true)).toBe(true);
    });

    it('returns false for unauthenticated users', () => {
      expect(shouldShowFeedTabs(false)).toBe(false);
    });
  });

  describe('getNextFeedType', () => {
    it('switches from global to user feed', () => {
      expect(getNextFeedType(FeedType.GLOBAL)).toBe(FeedType.FEED);
    });

    it('switches from user feed to global', () => {
      expect(getNextFeedType(FeedType.FEED)).toBe(FeedType.GLOBAL);
    });
  });

  describe('Feed Type Validation', () => {
    it('handles all valid feed types', () => {
      const feedTypes = [FeedType.GLOBAL, FeedType.FEED];

      feedTypes.forEach(feedType => {
        expect(() => getEmptyFeedMessage(feedType, true)).not.toThrow();
        expect(() => getNextFeedType(feedType)).not.toThrow();
      });
    });
  });
});
