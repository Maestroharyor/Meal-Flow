import React from 'react';
import { act, fireEvent, render, screen } from '@/lib/test-utils';
import { Groceries } from '../groceries';

// Mock the bottom sheet component
jest.mock('@gorhom/bottom-sheet', () => {
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: View,
    BottomSheetBackdrop: View,
    BottomSheetModal: View,
    BottomSheetModalProvider: ({ children }: { children: React.ReactNode }) => children,
    useBottomSheetModal: () => ({
      dismiss: jest.fn(),
      present: jest.fn(),
    }),
  };
});

// Mock the icons
jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

describe('Groceries', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the header', () => {
    render(<Groceries />);
    expect(screen.getByText('Grocery List')).toBeOnTheScreen();
    expect(screen.getByText('Keep track of your shopping items')).toBeOnTheScreen();
  });

  it('shows initial grocery items', () => {
    render(<Groceries />);
    expect(screen.getByText('Apples')).toBeOnTheScreen();
    expect(screen.getByText('Produce')).toBeOnTheScreen();
  });

  it('opens month selector', async () => {
    render(<Groceries />);
    const monthSelector = screen.getByText('April 2025');

    await act(async () => {
      fireEvent.press(monthSelector);
    });

    expect(screen.getByText('Select Month')).toBeOnTheScreen();
  });

  it('adds a new item when submitting the form', async () => {
    render(<Groceries />);
    const addButton = screen.getByTestId('add-item-button');

    await act(async () => {
      fireEvent.press(addButton);
    });

    const nameInput = screen.getByPlaceholderText('Item name');
    const quantityInput = screen.getByPlaceholderText('Quantity');
    const priceInput = screen.getByPlaceholderText('Price (optional)');
    const submitButton = screen.getByTestId('submit-form-button');

    await act(async () => {
      fireEvent.changeText(nameInput, 'Bananas');
      fireEvent.changeText(quantityInput, '3');
      fireEvent.changeText(priceInput, '4.99');
      fireEvent.press(submitButton);
    });

    expect(screen.getByText('Bananas')).toBeOnTheScreen();
    expect(screen.getByText('Qty: 3 • $4.99')).toBeOnTheScreen();
  });

  it('edits an existing item', async () => {
    render(<Groceries />);
    const editButton = screen.getByTestId('edit-item-0');
    
    await act(async () => {
      fireEvent.press(editButton);
    });

    const nameInput = screen.getByPlaceholderText('Item name');
    const quantityInput = screen.getByPlaceholderText('Quantity');
    const priceInput = screen.getByPlaceholderText('Price (optional)');
    const submitButton = screen.getByTestId('submit-form-button');

    await act(async () => {
      fireEvent.changeText(nameInput, 'Green Apples');
      fireEvent.changeText(quantityInput, '8');
      fireEvent.changeText(priceInput, '7.99');
      fireEvent.press(submitButton);
    });

    expect(screen.getByText('Green Apples')).toBeOnTheScreen();
    expect(screen.getByText('Qty: 8 • $7.99')).toBeOnTheScreen();
  });

  it('deletes an item', async () => {
    render(<Groceries />);
    const deleteButton = screen.getByTestId('delete-item-0');
    
    await act(async () => {
      fireEvent.press(deleteButton);
    });

    expect(screen.queryByText('Apples')).not.toBeOnTheScreen();
  });

  it('toggles item completion status', async () => {
    render(<Groceries />);
    const checkbox = screen.getByTestId('toggle-item-0');

    await act(async () => {
      fireEvent.press(checkbox);
    });

    const itemText = screen.getByText('Apples');
    expect(itemText.props.style).toEqual(expect.objectContaining({
      textDecorationLine: 'line-through'
    }));
  });

  it('changes selected month', async () => {
    render(<Groceries />);
    const monthSelector = screen.getByText('April 2025');

    await act(async () => {
      fireEvent.press(monthSelector);
    });

    const newMonth = screen.getByText('May 2025');

    await act(async () => {
      fireEvent.press(newMonth);
    });

    expect(screen.getByText('May 2025')).toBeOnTheScreen();
  });
});