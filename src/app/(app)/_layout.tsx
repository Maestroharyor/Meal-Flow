/* eslint-disable react/no-unstable-nested-components */
import { Redirect, SplashScreen, Tabs } from 'expo-router';
import React, { useCallback, useEffect } from 'react';

import {
  Groceries as GroceriesIcon,
  Meals as MealsIcon,
  Recipes as RecipesIcon,
  Settings as SettingsIcon,
} from '@/components/ui/icons';
import { useAuth, useIsFirstTime } from '@/lib';

// Define the routes explicitly - this helps with router config
export const unstable_settings = {
  initialRouteName: 'groceries',
  tabBarOptions: {
    showLabel: true,
  },
};

// Helper function to setup and handle splash screen
function useSplashScreen(status: string) {
  const hideSplash = useCallback(async () => {
    await SplashScreen.hideAsync();
  }, []);

  useEffect(() => {
    if (status !== 'idle') {
      setTimeout(() => {
        hideSplash();
      }, 1000);
    }
  }, [hideSplash, status]);
}

export default function TabLayout() {
  const status = useAuth.use.status();
  const [isFirstTime] = useIsFirstTime();

  // Handle splash screen
  useSplashScreen(status);

  if (isFirstTime) {
    return <Redirect href="/onboarding" />;
  }

  if (status === 'signOut') {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      initialRouteName="groceries"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2FA45A', // Use primary.500 green color
      }}
    >
      <Tabs.Screen
        name="groceries"
        options={{
          title: 'Groceries',
          tabBarIcon: ({ color }) => <GroceriesIcon color={color} />,
          tabBarButtonTestID: 'groceries-tab',
        }}
      />

      <Tabs.Screen
        name="meals"
        options={{
          title: 'Meals',
          tabBarIcon: ({ color }) => <MealsIcon color={color} />,
          tabBarButtonTestID: 'meals-tab',
        }}
      />

      <Tabs.Screen
        name="recipes"
        options={{
          title: 'Recipes',
          tabBarIcon: ({ color }) => <RecipesIcon color={color} />,
          tabBarButtonTestID: 'recipes-tab',
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <SettingsIcon color={color} />,
          tabBarButtonTestID: 'settings-tab',
        }}
      />
    </Tabs>
  );
}
