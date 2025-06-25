/* eslint-disable no-console */
export class Logger {
  public static log(message: string, ...args: unknown[]): void {
    console.log(message, ...args);
  }

  public static error(message: string, ...args: unknown[]): void {
    console.error(message, ...args);
  }

  public static warn(message: string, ...args: unknown[]): void {
    console.warn(message, ...args);
  }

  public static info(message: string, ...args: unknown[]): void {
    console.info(message, ...args);
  }

  public static debug(message: string, ...args: unknown[]): void {
    console.debug(message, ...args);
  }
}
/* eslint-enable no-console */
