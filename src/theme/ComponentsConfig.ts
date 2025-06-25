import { ThemeManager } from 'react-native-ui-lib';

import { TYPOGRAPHY } from '../constants/styles';

import { loadFoundationPresets } from './loadFoundationPresets';

class ComponentsConfigurator {
  private _isInitialized: boolean = false;
  private _configuredComponents: Set<string> = new Set();

  public initializeComponentThemes(): void {
    if (this._isInitialized) {
      return;
    }

    loadFoundationPresets();

    this.configureTextDefaults();
    this.configureButtonDefaults();
    this.configureTextFieldDefaults();

    this._isInitialized = true;
  }

  public get isInitialized(): boolean {
    return this._isInitialized;
  }

  public get configuredComponents(): string[] {
    return Array.from(this._configuredComponents);
  }

  public configureTextDefaults(): void {
    ThemeManager.setComponentTheme('Text', {
      style: {
        fontFamily: TYPOGRAPHY.BOLD.fontFamily,
      },
    });
    this._configuredComponents.add('Text');
  }

  public configureButtonDefaults(): void {
    ThemeManager.setComponentTheme('Button', {
      style: {
        fontFamily: TYPOGRAPHY.BOLD.fontFamily,
      },
    });
    this._configuredComponents.add('Button');
  }

  public configureTextFieldDefaults(): void {
    ThemeManager.setComponentTheme('TextField', {
      style: {
        fontFamily: TYPOGRAPHY.BODY.fontFamily,
      },
    });
    this._configuredComponents.add('TextField');
  }
}

export const componentsConfigurator = new ComponentsConfigurator();
