import React from 'react';

type BottomSheetModalProps = {
  children: React.ReactNode;
  onDismiss?: () => void;
};

export const BottomSheetModal = React.forwardRef<any, BottomSheetModalProps>(
  ({ children, onDismiss }, ref) => {
    React.useImperativeHandle(ref, () => ({
      present: jest.fn(),
      dismiss: jest.fn(() => {
        if (onDismiss) onDismiss();
      }),
    }));
    return <>{children}</>;
  }
);

export const BottomSheetBackdrop = () => null;
