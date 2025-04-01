import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';

// Mock React Navigation hooks
jest.mock('@react-navigation/native', () => {
  return {
    useIsFocused: () => true,
    useColorScheme: () => ({ colorScheme: 'light' }),
  };
});

// Mock modules before importing the component
jest.mock('@gorhom/bottom-sheet', () => {
  return {
    BottomSheetModal: require('../(app)/__mocks__/bottom-sheet').BottomSheetModal,
    BottomSheetBackdrop: require('../(app)/__mocks__/bottom-sheet').BottomSheetBackdrop,
  };
});

// Mock Ionicons
jest.mock('@expo/vector-icons', () => {
  const { View } = require('react-native');
  return {
    Ionicons: ({ name, size, color }: { name: string; size: number; color: string }) => (
      <View testID={`icon-${name}`} />
    ),
  };
});

// Mock UI components
jest.mock('@/components/ui', () => {
  const { Text: RNText, View } = require('react-native');
  
  return {
    Text: (props: any) => <RNText {...props} />,
    View: (props: any) => <View {...props} />,
    Button: ({ label, onPress, testID }: { label: string; onPress: () => void; testID?: string }) => (
      <View testID={testID} onPress={onPress}>
        <RNText>{label}</RNText>
      </View>
    ),
    Checkbox: ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
      <View testID={`checkbox-${checked ? 'checked' : 'unchecked'}`} onPress={onChange} />
    ),
    Select: ({ value, options, onSelect }: { value: string; options: any[]; onSelect: (value: string) => void }) => (
      <View testID="select-component">
        <RNText>{value}</RNText>
      </View>
    ),
    FocusAwareStatusBar: () => null,
  };
});

// Import the component after mocking
import Groceries from '../(app)/groceries';

describe('Groceries', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders grocery list title', () => {
    render(<Groceries />);
    
    // Check header text
    expect(screen.getByText('Grocery List')).toBeTruthy();
  });

  it('opens the add item form when add button is clicked', () => {
    const { getByTestId, getByText } = render(<Groceries />);
    
    // Find and press the add button
    const addButton = getByTestId('add-item-button');
    fireEvent.press(addButton);
    
    // Form should be visible with the right title
    expect(getByText('Add New Item')).toBeTruthy();
  });
}); 