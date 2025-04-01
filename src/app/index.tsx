import { Redirect } from 'expo-router';
import React from 'react';

// This top level index will ensure redirection to the groceries tab
export default function AppIndex() {
  return <Redirect href="/(app)/groceries" />;
}
