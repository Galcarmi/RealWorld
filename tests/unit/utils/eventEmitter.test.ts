import {
  appEventEmitter,
  EVENT_NAMES,
  AuthErrorEvent,
} from '../../../src/utils/eventEmitter';

describe('AppEventEmitter', () => {
  let mockCallback: jest.Mock<void, [AuthErrorEvent]>;
  let mockCallback2: jest.Mock<void, [AuthErrorEvent]>;

  beforeEach(() => {
    mockCallback = jest.fn();
    mockCallback2 = jest.fn();
    appEventEmitter.cleanup();
  });

  afterEach(() => {
    appEventEmitter.cleanup();
  });

  describe('emitAuthError', () => {
    it('should emit auth error event with correct payload', () => {
      const startTime = Date.now();

      appEventEmitter.onAuthError(mockCallback);
      appEventEmitter.emitAuthError();

      expect(mockCallback).toHaveBeenCalledTimes(1);

      const emittedEvent = mockCallback.mock.calls[0][0];
      expect(emittedEvent.type).toBe(EVENT_NAMES.UNAUTHORIZED_ERROR);
      expect(emittedEvent.timestamp).toBeInstanceOf(Date);
      expect(emittedEvent.timestamp.getTime()).toBeGreaterThanOrEqual(
        startTime
      );
    });

    it('should not throw if no listeners are registered', () => {
      expect(() => appEventEmitter.emitAuthError()).not.toThrow();
    });

    it('should emit to multiple listeners', () => {
      appEventEmitter.onAuthError(mockCallback);
      appEventEmitter.onAuthError(mockCallback2);

      appEventEmitter.emitAuthError();

      expect(mockCallback).toHaveBeenCalledTimes(1);
      expect(mockCallback2).toHaveBeenCalledTimes(1);
    });
  });

  describe('onAuthError', () => {
    it('should register auth error listener', () => {
      appEventEmitter.onAuthError(mockCallback);
      appEventEmitter.emitAuthError();

      expect(mockCallback).toHaveBeenCalledTimes(1);
    });

    it('should allow multiple listeners', () => {
      appEventEmitter.onAuthError(mockCallback);
      appEventEmitter.onAuthError(mockCallback2);

      appEventEmitter.emitAuthError();

      expect(mockCallback).toHaveBeenCalledTimes(1);
      expect(mockCallback2).toHaveBeenCalledTimes(1);
    });
  });

  describe('offAuthError', () => {
    it('should remove specific auth error listener', () => {
      appEventEmitter.onAuthError(mockCallback);
      appEventEmitter.onAuthError(mockCallback2);

      appEventEmitter.offAuthError(mockCallback);
      appEventEmitter.emitAuthError();

      expect(mockCallback).not.toHaveBeenCalled();
      expect(mockCallback2).toHaveBeenCalledTimes(1);
    });

    it('should not throw if trying to remove non-existent listener', () => {
      expect(() => appEventEmitter.offAuthError(mockCallback)).not.toThrow();
    });
  });

  describe('removeAllAuthErrorListeners', () => {
    it('should remove all auth error listeners', () => {
      appEventEmitter.onAuthError(mockCallback);
      appEventEmitter.onAuthError(mockCallback2);

      appEventEmitter.removeAllAuthErrorListeners();
      appEventEmitter.emitAuthError();

      expect(mockCallback).not.toHaveBeenCalled();
      expect(mockCallback2).not.toHaveBeenCalled();
    });
  });

  describe('cleanup', () => {
    it('should remove all listeners', () => {
      appEventEmitter.onAuthError(mockCallback);
      appEventEmitter.onAuthError(mockCallback2);

      appEventEmitter.cleanup();
      appEventEmitter.emitAuthError();

      expect(mockCallback).not.toHaveBeenCalled();
      expect(mockCallback2).not.toHaveBeenCalled();
    });
  });

  describe('EVENT_NAMES', () => {
    it('should have correct event name constants', () => {
      expect(EVENT_NAMES.UNAUTHORIZED_ERROR).toBe('UNAUTHORIZED_ERROR');
    });
  });
});
