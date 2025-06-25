import { EventEmitter } from 'eventemitter3';

export const EVENT_NAMES = {
  UNAUTHORIZED_ERROR: 'UNAUTHORIZED_ERROR',
} as const;

export type AuthErrorEvent = {
  type: 'UNAUTHORIZED_ERROR';
  timestamp: Date;
};

class AppEventEmitter extends EventEmitter {
  private static instance: AppEventEmitter;

  constructor() {
    super();
  }

  public emitAuthError(): void {
    this.emit(EVENT_NAMES.UNAUTHORIZED_ERROR, {
      type: EVENT_NAMES.UNAUTHORIZED_ERROR,
      timestamp: new Date(),
    });
  }

  public onAuthError(callback: (event: AuthErrorEvent) => void): void {
    this.on(EVENT_NAMES.UNAUTHORIZED_ERROR, callback);
  }

  public offAuthError(callback: (event: AuthErrorEvent) => void): void {
    this.off(EVENT_NAMES.UNAUTHORIZED_ERROR, callback);
  }

  public removeAllAuthErrorListeners(): void {
    this.removeAllListeners(EVENT_NAMES.UNAUTHORIZED_ERROR);
  }

  public cleanup(): void {
    this.removeAllListeners();
  }
}

export const appEventEmitter = new AppEventEmitter();
