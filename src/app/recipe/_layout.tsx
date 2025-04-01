import { Stack } from 'expo-router';
import React from 'react';

export default function RecipeLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        presentation: 'modal',
      }}
    >
      <Stack.Screen
        name="[id]"
        options={{
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="[id]/edit"
        options={{
          presentation: 'modal',
        }}
      />
    </Stack>
  );
}
