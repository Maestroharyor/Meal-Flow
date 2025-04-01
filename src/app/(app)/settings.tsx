/* eslint-disable react/react-in-jsx-scope */
import { Ionicons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Pressable } from 'react-native';

import {
  Button,
  FocusAwareStatusBar,
  Input,
  ScrollView,
  Text,
  View,
} from '@/components/ui';

// Type definition for currency objects
type Currency = {
  code: string;
  symbol: string;
  name: string;
};

// List of major currencies
const currencies: Currency[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
  { code: 'RUB', symbol: '₽', name: 'Russian Ruble' },
  { code: 'KRW', symbol: '₩', name: 'South Korean Won' },
  { code: 'MXN', symbol: '$', name: 'Mexican Peso' },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
];

// Currency selector item component
function CurrencySelectorItem({
  currency,
  isSelected,
  onSelect,
}: {
  currency: Currency;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <Pressable
      key={currency.code}
      className={`mb-2 flex-row items-center justify-between rounded-md p-3 ${
        isSelected ? 'bg-primary-100' : ''
      }`}
      onPress={onSelect}
    >
      <View className="flex-row items-center">
        <Text className="mr-2 text-lg font-medium">{currency.symbol}</Text>
        <Text>
          {currency.name} ({currency.code})
        </Text>
      </View>
      {isSelected && <Text className="text-primary-500">✓</Text>}
    </Pressable>
  );
}

// Currency search input component
function CurrencySearchInput({
  searchQuery,
  setSearchQuery,
}: {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}) {
  return (
    <View className="mb-4 flex-row items-center rounded-lg border border-gray-200 bg-white px-3 py-2">
      <Ionicons name="search-outline" size={20} color="#999" />
      <Input
        placeholder="Search currencies..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        className="flex-1 border-0 bg-transparent px-2 text-base"
        autoCapitalize="none"
      />
      {searchQuery.length > 0 && (
        <Pressable onPress={() => setSearchQuery('')}>
          <Ionicons name="close-circle" size={20} color="#999" />
        </Pressable>
      )}
    </View>
  );
}

// Currency list component
function CurrencyList({
  currencies,
  selectedCurrency,
  onSelectCurrency,
  bottomSheetRef,
}: {
  currencies: Currency[];
  selectedCurrency: Currency;
  onSelectCurrency: (currency: Currency) => void;
  bottomSheetRef: React.RefObject<BottomSheet>;
}) {
  return (
    <ScrollView className="flex-1">
      {currencies.length === 0 ? (
        <Text className="text-center text-gray-500">No currencies found</Text>
      ) : (
        currencies.map((currency) => (
          <CurrencySelectorItem
            key={currency.code}
            currency={currency}
            isSelected={selectedCurrency.code === currency.code}
            onSelect={() => {
              onSelectCurrency(currency);
              bottomSheetRef.current?.close();
            }}
          />
        ))
      )}
    </ScrollView>
  );
}

// Currency Selector Bottom Sheet
function CurrencySelector({
  currencies,
  selectedCurrency,
  onSelectCurrency,
  onClose,
}: {
  currencies: Currency[];
  selectedCurrency: Currency;
  onSelectCurrency: (currency: Currency) => void;
  onClose: () => void;
}) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = ['70%'];
  const [searchQuery, setSearchQuery] = useState('');

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    []
  );

  // Filter currencies based on search query
  const filteredCurrencies = useMemo(() => {
    if (!searchQuery.trim()) return currencies;

    const query = searchQuery.toLowerCase();
    return currencies.filter(
      (currency) =>
        currency.code.toLowerCase().includes(query) ||
        currency.name.toLowerCase().includes(query) ||
        currency.symbol.toLowerCase().includes(query)
    );
  }, [currencies, searchQuery]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      enablePanDownToClose
      onClose={onClose}
    >
      <View className="flex-1 p-5">
        <Text className="mb-4 text-center text-xl font-bold">
          Select Currency
        </Text>
        <CurrencySearchInput
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        <CurrencyList
          currencies={filteredCurrencies}
          selectedCurrency={selectedCurrency}
          onSelectCurrency={onSelectCurrency}
          bottomSheetRef={bottomSheetRef}
        />
      </View>
    </BottomSheet>
  );
}

// Custom Switch component since we can't use the one from @/components/ui
function CustomSwitch({
  value,
  onValueChange,
}: {
  value: boolean;
  onValueChange: (value: boolean) => void;
}) {
  return (
    <Pressable
      className={`h-6 w-12 rounded-full ${
        value ? 'bg-green-500' : 'bg-gray-300'
      }`}
      onPress={() => onValueChange(!value)}
    >
      <View
        className={`size-6 rounded-full bg-white shadow-sm ${
          value ? 'ml-6' : 'ml-0'
        }`}
      />
    </Pressable>
  );
}

// Settings header component
function SettingsHeader() {
  return (
    <>
      <Text className="text-center text-2xl font-bold">Settings</Text>
      <Text className="text-center text-gray-500">
        Customize your app experience
      </Text>
    </>
  );
}

// Settings section header
function SectionHeader({ title }: { title: string }) {
  return (
    <Text className="mb-2 mt-6 font-bold uppercase text-gray-500">{title}</Text>
  );
}

// Toggle setting item
function ToggleSetting({
  icon,
  label,
  value,
  onValueChange,
  description,
}: {
  icon: any;
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  description?: string;
}) {
  return (
    <View className="mb-4 flex-row items-center justify-between rounded-lg border border-gray-200 bg-white p-4">
      <View className="flex-row items-center">
        <View className="mr-3 items-center justify-center rounded-full bg-gray-100 p-2">
          <Ionicons name={icon} size={20} color="#000" />
        </View>
        <View>
          <Text className="font-medium">{label}</Text>
          {description && <Text className="text-gray-500">{description}</Text>}
        </View>
      </View>
      <CustomSwitch value={value} onValueChange={onValueChange} />
    </View>
  );
}

// Pressable setting item
function PressableSetting({
  icon,
  label,
  rightText,
  onPress,
  description,
}: {
  icon: any;
  label: string;
  rightText?: string;
  onPress: () => void;
  description?: string;
}) {
  return (
    <Pressable
      className="mb-4 flex-row items-center justify-between rounded-lg border border-gray-200 bg-white p-4"
      onPress={onPress}
    >
      <View className="flex-row items-center">
        <View className="mr-3 items-center justify-center rounded-full bg-gray-100 p-2">
          <Ionicons name={icon} size={20} color="#000" />
        </View>
        <View>
          <Text className="font-medium">{label}</Text>
          {description && <Text className="text-gray-500">{description}</Text>}
        </View>
      </View>
      <View className="flex-row items-center">
        {rightText && <Text className="mr-2 text-gray-500">{rightText}</Text>}
        <Ionicons name="chevron-forward" size={20} color="#999" />
      </View>
    </Pressable>
  );
}

// Account settings section
function AccountSection({
  onProfilePress,
  onNotificationsPress,
  onPrivacyPress,
}: {
  onProfilePress: () => void;
  onNotificationsPress: () => void;
  onPrivacyPress: () => void;
}) {
  return (
    <>
      <SectionHeader title="Account" />
      <PressableSetting
        icon="person-outline"
        label="Profile"
        onPress={onProfilePress}
      />
      <PressableSetting
        icon="notifications-outline"
        label="Notifications"
        onPress={onNotificationsPress}
      />
      <PressableSetting
        icon="lock-closed-outline"
        label="Privacy"
        onPress={onPrivacyPress}
      />
    </>
  );
}

// Appearance settings section
function AppearanceSection({
  isDarkMode,
  setIsDarkMode,
}: {
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
}) {
  return (
    <>
      <SectionHeader title="Appearance" />
      <ToggleSetting
        icon="moon-outline"
        label="Dark Mode"
        value={isDarkMode}
        onValueChange={setIsDarkMode}
        description="Use darker colors for night viewing"
      />
      <PressableSetting
        icon="color-palette-outline"
        label="Theme"
        rightText="Default"
        onPress={() => {
          // Show theme picker
        }}
      />
    </>
  );
}

// Preferences settings section
function PreferencesSection({
  useMetric,
  setUseMetric,
  selectedCurrency,
  onCurrencyPress,
  onLanguagePress,
}: {
  useMetric: boolean;
  setUseMetric: (value: boolean) => void;
  selectedCurrency: Currency;
  onCurrencyPress: () => void;
  onLanguagePress: () => void;
}) {
  return (
    <>
      <SectionHeader title="Preferences" />
      <ToggleSetting
        icon="scale-outline"
        label="Use Metric System"
        value={useMetric}
        onValueChange={setUseMetric}
        description="Use kg and cm instead of lb and inches"
      />
      <PressableSetting
        icon="cash-outline"
        label="Currency"
        rightText={`${selectedCurrency.code} (${selectedCurrency.symbol})`}
        onPress={onCurrencyPress}
        description="Set your preferred currency for prices"
      />
      <PressableSetting
        icon="language-outline"
        label="Language"
        rightText="English"
        onPress={onLanguagePress}
      />
    </>
  );
}

// About & Help settings section
function AboutHelpSection({
  onAboutPress,
  onHelpPress,
  onTermsPress,
}: {
  onAboutPress: () => void;
  onHelpPress: () => void;
  onTermsPress: () => void;
}) {
  return (
    <>
      <SectionHeader title="About & Help" />
      <PressableSetting
        icon="information-circle-outline"
        label="About"
        onPress={onAboutPress}
      />
      <PressableSetting
        icon="help-circle-outline"
        label="Help & Support"
        onPress={onHelpPress}
      />
      <PressableSetting
        icon="document-text-outline"
        label="Terms & Policies"
        onPress={onTermsPress}
      />
    </>
  );
}

// Settings content component
function SettingsContent({
  isDarkMode,
  setIsDarkMode,
  useMetric,
  setUseMetric,
  selectedCurrency,
  onCurrencyPress,
  handleSignOut,
}: {
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
  useMetric: boolean;
  setUseMetric: (value: boolean) => void;
  selectedCurrency: Currency;
  onCurrencyPress: () => void;
  handleSignOut: () => void;
}) {
  return (
    <ScrollView className="mt-4">
      <AccountSection
        onProfilePress={() => {
          // Navigate to profile screen
        }}
        onNotificationsPress={() => {
          // Navigate to notifications screen
        }}
        onPrivacyPress={() => {
          // Navigate to privacy screen
        }}
      />

      <AppearanceSection
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />

      <PreferencesSection
        useMetric={useMetric}
        setUseMetric={setUseMetric}
        selectedCurrency={selectedCurrency}
        onCurrencyPress={onCurrencyPress}
        onLanguagePress={() => {
          // Show language picker
        }}
      />

      <AboutHelpSection
        onAboutPress={() => {
          // Navigate to about screen
        }}
        onHelpPress={() => {
          // Navigate to help screen
        }}
        onTermsPress={() => {
          // Navigate to terms screen
        }}
      />

      <View className="mb-6 mt-8">
        <Button label="Sign Out" variant="outline" onPress={handleSignOut} />
      </View>
    </ScrollView>
  );
}

// Main component
export default function Settings() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [useMetric, setUseMetric] = useState(true);
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]); // Default to USD
  const [isCurrencySelectorOpen, setIsCurrencySelectorOpen] = useState(false);

  function handleSignOut() {
    // Implementation for sign out
    console.log('Sign out');
  }

  return (
    <>
      <FocusAwareStatusBar />
      <View className="flex-1 bg-gray-50 p-4 pt-12">
        <SettingsHeader />

        <SettingsContent
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          useMetric={useMetric}
          setUseMetric={setUseMetric}
          selectedCurrency={selectedCurrency}
          onCurrencyPress={() => setIsCurrencySelectorOpen(true)}
          handleSignOut={handleSignOut}
        />

        {isCurrencySelectorOpen && (
          <CurrencySelector
            currencies={currencies}
            selectedCurrency={selectedCurrency}
            onSelectCurrency={setSelectedCurrency}
            onClose={() => setIsCurrencySelectorOpen(false)}
          />
        )}
      </View>
    </>
  );
}
