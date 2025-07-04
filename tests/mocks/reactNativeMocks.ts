jest.mock('../../src/utils/alertUtils', () => ({
  showErrorAlert: jest.fn(),
  showInfoAlert: jest.fn(),
  showConfirmAlert: jest.fn(),
}));

jest.mock('react-native-ui-lib', () => {
  const React = require('react');
  return {
    View: (props: any) => React.createElement('View', props),
    Text: (props: any) => React.createElement('Text', props),
    Button: (props: any) =>
      React.createElement(
        'View',
        {
          testID: props.testID,
          accessible: true,
          accessibilityState: { disabled: !!props.disabled },
        },
        props.label && React.createElement('Text', null, props.label)
      ),
    TextField: (props: any) => React.createElement('TextInput', props),
    Colors: { loadColors: jest.fn() },
    Typography: { loadTypographies: jest.fn() },
  };
});
