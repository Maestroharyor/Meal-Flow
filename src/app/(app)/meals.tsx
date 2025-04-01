/* eslint-disable max-lines-per-function */
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, TextInput } from 'react-native';

import {
  Button,
  FocusAwareStatusBar,
  Modal,
  Text,
  useModal,
  View,
} from '@/components/ui';

type Meal = {
  id: string;
  name: string;
  recipeId?: string;
};

type DayMeals = {
  breakfast?: Meal;
  lunch?: Meal;
  dinner?: Meal;
};

type Recipe = {
  id: string;
  name: string;
  category: string;
  cookTime: number;
  ingredients: string[];
  instructions: string[];
};

// Sample recipes data
const recipesData: Recipe[] = [
  {
    id: '1',
    name: 'Avocado Toast',
    category: 'Breakfast',
    cookTime: 10,
    ingredients: [
      '2 slices bread',
      '1 avocado',
      'Salt',
      'Pepper',
      'Red pepper flakes',
    ],
    instructions: [
      'Toast bread until golden and firm.',
      'Remove pits from avocados, scoop into bowl, and mash with fork.',
      'Spread avocado on toast, sprinkle with salt, pepper, and red pepper flakes.',
    ],
  },
  {
    id: '2',
    name: 'Greek Salad',
    category: 'Lunch',
    cookTime: 15,
    ingredients: ['Cucumber', 'Tomatoes', 'Red onion'],
    instructions: [],
  },
  {
    id: '3',
    name: 'Chicken Stir Fry',
    category: 'Dinner',
    cookTime: 25,
    ingredients: ['Chicken breast', 'Bell peppers', 'Broccoli'],
    instructions: [],
  },
];

type WeekPlan = {
  [day: string]: DayMeals;
};

type MonthPlan = {
  [weekNumber: string]: WeekPlan;
};

const daysOfWeek = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const mealTypes = ['Breakfast', 'Lunch', 'Dinner'] as const;
type MealType = (typeof mealTypes)[number];

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const DEFAULT_MONTHS = [
  ...MONTHS.map((month) => `${month} 2025`),
  ...MONTHS.map((month) => `${month} 2024`),
  ...MONTHS.map((month) => `${month} 2023`),
];

// Common header component
function Header() {
  return (
    <View className="px-4 pt-4">
      <Text className="text-2xl font-bold">Food Planner</Text>
      <Text className="text-gray-500">Manage your meals and recipes</Text>
    </View>
  );
}

// Week selector component
function WeekSelector({
  currentWeek,
  onWeekChange,
  availableWeeks,
  onAddWeek,
}: {
  currentWeek: string;
  onWeekChange: (week: string) => void;
  availableWeeks: string[];
  onAddWeek: () => void;
}) {
  return (
    <View className="px-4">
      <View className="mt-4 flex-row items-center justify-between">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="flex-row space-x-2"
        >
          {availableWeeks.map((week) => (
            <Pressable
              key={week}
              onPress={() => onWeekChange(week)}
              className={`rounded-full px-6 py-2 ${
                currentWeek === week ? 'bg-primary-500' : 'bg-gray-100'
              }`}
            >
              <Text
                className={`text-base font-medium ${
                  currentWeek === week ? 'text-white' : 'text-gray-700'
                }`}
              >
                Week {week}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {availableWeeks.length < 4 && (
          <Pressable
            onPress={onAddWeek}
            className="ml-2 rounded-full bg-gray-100 p-2"
          >
            <Ionicons name="add" size={24} color="#666" />
          </Pressable>
        )}
      </View>
    </View>
  );
}

// Month selector component
function MonthSelector({
  selectedMonth,
  onPress,
}: {
  selectedMonth: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      className="mx-4 mt-4 flex-row items-center justify-between rounded-xl bg-gray-100 p-4"
      onPress={onPress}
    >
      <Text className="text-lg font-medium">{selectedMonth}</Text>
      <Ionicons name="chevron-down" size={24} color="#666" />
    </Pressable>
  );
}

// Day meal planner component
function DayMealPlanner({
  day,
  dayMeals,
  onAddMeal,
  onEditMeal,
}: {
  day: string;
  dayMeals: DayMeals;
  onAddMeal: (day: string, type: MealType) => void;
  onEditMeal: (day: string, type: MealType, meal: Meal) => void;
}) {
  const totalMeals = 3; // Total possible meals per day (breakfast, lunch, dinner)
  const completedMeals = Object.values(dayMeals).filter(Boolean).length;
  const progress = Math.round((completedMeals / totalMeals) * 100);

  return (
    <View className="mb-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <View className="border-b border-gray-200 bg-gray-50 px-4 py-3">
        <View className="flex-row items-center justify-between">
          <Text className="text-lg font-medium text-gray-800">{day}</Text>
          <View className="flex-row items-center space-x-2">
            <View className="rounded-full bg-gray-100 px-2 py-1">
              <Text className="text-sm text-gray-600">
                {completedMeals}/{totalMeals}
              </Text>
            </View>
            <View className="rounded-full bg-primary-50 px-2 py-1">
              <Text className="text-sm font-medium text-primary-700">
                {progress}%
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View className="divide-y divide-gray-100">
        {mealTypes.map((type) => {
          const mealKey = type.toLowerCase() as keyof DayMeals;
          const meal = dayMeals[mealKey];

          return (
            <Pressable
              key={type}
              onPress={() =>
                meal ? onEditMeal(day, type, meal) : onAddMeal(day, type)
              }
              className="flex-row items-center justify-between p-4"
            >
              <View className="flex-row items-center space-x-3">
                <View className="size-8 items-center justify-center rounded-full bg-gray-100">
                  <Ionicons
                    name={
                      type === 'Breakfast'
                        ? 'sunny'
                        : type === 'Lunch'
                          ? 'sunny'
                          : 'moon'
                    }
                    size={16}
                    color="#666"
                  />
                </View>
                <View>
                  <Text className="text-base font-medium text-gray-800">
                    {type}
                  </Text>
                  <Text className="text-sm text-gray-500">
                    {meal?.name || 'Add meal'}
                  </Text>
                </View>
              </View>
              <Ionicons
                name={meal ? 'pencil' : 'add-circle'}
                size={20}
                color={meal ? '#666' : '#10b981'}
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

// Week planner component
function WeekPlanner({
  weekPlan,
  onAddMeal,
  onEditMeal,
}: {
  weekPlan: WeekPlan;
  onAddMeal: (day: string, type: MealType) => void;
  onEditMeal: (day: string, type: MealType, meal: Meal) => void;
}) {
  return (
    <ScrollView className="flex-1">
      <View className="p-4">
        {daysOfWeek.map((day) => (
          <DayMealPlanner
            key={day}
            day={day}
            dayMeals={weekPlan[day] || {}}
            onAddMeal={onAddMeal}
            onEditMeal={onEditMeal}
          />
        ))}
      </View>
    </ScrollView>
  );
}

function MonthSearchBar({
  search,
  setSearch,
}: {
  search: string;
  setSearch: (text: string) => void;
}) {
  return (
    <View className="mb-4 rounded-lg border border-gray-200 bg-white p-2">
      <View className="flex-row items-center">
        <Ionicons name="search" size={18} color="#666" />
        <TextInput
          className="ml-2 flex-1 text-base"
          placeholder="Search months..."
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <Pressable onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={18} color="#666" />
          </Pressable>
        )}
      </View>
    </View>
  );
}

function MonthOption({
  month,
  selectedMonth,
  onSelect,
  onSetDefault,
  isDefault,
}: {
  month: string;
  selectedMonth: string;
  onSelect: (month: string) => void;
  onSetDefault: (month: string) => void;
  isDefault: boolean;
}) {
  const isSelected = selectedMonth === month;

  return (
    <View className="mb-2">
      <Pressable
        onPress={() => onSelect(month)}
        className={`flex-row items-center justify-between rounded-lg ${
          isSelected ? 'border border-primary-200 bg-primary-50' : 'bg-gray-50'
        } p-3`}
      >
        <View className="flex-row items-center gap-2">
          <Text
            className={`text-base ${isSelected ? 'font-bold text-primary-600' : ''}`}
          >
            {month}
          </Text>
          {isSelected && (
            <View className="ml-2">
              <Ionicons name="checkmark-circle" size={18} color="#10b981" />
            </View>
          )}
        </View>

        <Pressable
          onPress={() => onSetDefault(month)}
          className="ml-2 rounded-full p-2"
          hitSlop={8}
        >
          <Ionicons
            name={isDefault ? 'star' : 'star-outline'}
            size={18}
            color={isDefault ? '#f59e0b' : '#666'}
          />
        </Pressable>
      </Pressable>
    </View>
  );
}

function MonthSelect({
  months,
  selectedMonth,
  onSelectMonth,
  currentMonth,
}: {
  months: string[];
  selectedMonth: string;
  onSelectMonth: (month: string) => void;
  currentMonth: string;
}) {
  return (
    <View className="mb-6">
      <Text className="mb-2 text-sm font-medium text-gray-700">
        Select Month
      </Text>
      <View className="flex-row flex-wrap">
        {months.map((month) => {
          const isSelected = selectedMonth === month;
          const isCurrent = currentMonth === month;
          return (
            <Pressable
              key={month}
              onPress={() => onSelectMonth(month)}
              className={`m-1 rounded-lg px-3 py-2 ${
                isSelected
                  ? 'bg-primary-500'
                  : isCurrent
                    ? 'bg-green-500'
                    : 'bg-gray-100'
              }`}
            >
              <Text
                className={
                  isSelected || isCurrent ? 'text-white' : 'text-gray-800'
                }
              >
                {month}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function YearSelect({
  years,
  selectedYear,
  onSelectYear,
}: {
  years: string[];
  selectedYear: string;
  onSelectYear: (year: string) => void;
}) {
  return (
    <View className="mb-6">
      <Text className="mb-2 text-sm font-medium text-gray-700">
        Select Year
      </Text>
      <View className="flex-row flex-wrap">
        {years.map((year) => (
          <Pressable
            key={year}
            onPress={() => onSelectYear(year)}
            className={`m-1 rounded-lg px-4 py-2 ${
              selectedYear === year ? 'bg-primary-500' : 'bg-gray-100'
            }`}
          >
            <Text
              className={selectedYear === year ? 'text-white' : 'text-gray-800'}
            >
              {year}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function MonthExistsError({ monthName }: { monthName: string }) {
  return (
    <View className="mb-4 rounded-lg bg-red-50 p-3">
      <Text className="text-center text-red-600">
        "{monthName}" already exists in your meal planner
      </Text>
    </View>
  );
}

function useMonthYearSelector(existingMonths: string[]) {
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString()
  );
  const [selectedMonth, setSelectedMonth] = useState(
    MONTHS[new Date().getMonth()]
  );
  const currentMonth = MONTHS[new Date().getMonth()];

  const years = Array.from({ length: 5 }, (_, i) =>
    (new Date().getFullYear() + i).toString()
  );

  const fullMonthString = `${selectedMonth} ${selectedYear}`;
  const monthExists = existingMonths.includes(fullMonthString);

  return {
    selectedYear,
    setSelectedYear,
    selectedMonth,
    setSelectedMonth,
    currentMonth,
    years,
    fullMonthString,
    monthExists,
  };
}

function AddMonthModalContent({
  selectedMonth,
  selectedYear,
  currentMonth,
  years,
  monthExists,
  fullMonthString,
  onSelectMonth,
  onSelectYear,
  onAddMonth,
}: {
  selectedMonth: string;
  selectedYear: string;
  currentMonth: string;
  years: string[];
  monthExists: boolean;
  fullMonthString: string;
  onSelectMonth: (month: string) => void;
  onSelectYear: (year: string) => void;
  onAddMonth: () => void;
}) {
  return (
    <View className="flex-1 p-4">
      <MonthSelect
        months={MONTHS}
        selectedMonth={selectedMonth}
        onSelectMonth={onSelectMonth}
        currentMonth={currentMonth}
      />

      <YearSelect
        years={years}
        selectedYear={selectedYear}
        onSelectYear={onSelectYear}
      />

      {monthExists && <MonthExistsError monthName={fullMonthString} />}

      <View className="mt-6">
        <Button
          onPress={onAddMonth}
          className={`h-[44px] rounded-xl ${
            monthExists ? 'bg-gray-400' : 'bg-primary-500'
          }`}
          label={`Add ${selectedMonth} ${selectedYear}`}
          disabled={monthExists}
        />
      </View>
    </View>
  );
}

function AddMonthModal({
  isVisible,
  onClose,
  onAddMonth,
  existingMonths,
}: {
  isVisible: boolean;
  onClose: () => void;
  onAddMonth: (month: string) => void;
  existingMonths: string[];
}) {
  const { ref, present, dismiss } = useModal();
  const {
    selectedYear,
    setSelectedYear,
    selectedMonth,
    setSelectedMonth,
    currentMonth,
    years,
    fullMonthString,
    monthExists,
  } = useMonthYearSelector(existingMonths);

  useEffect(() => {
    if (isVisible) {
      present();
    } else {
      dismiss();
    }
  }, [isVisible, present, dismiss]);

  const handleAddMonth = () => {
    if (!monthExists) {
      onAddMonth(fullMonthString);
    }
  };

  return (
    <Modal
      ref={ref}
      onDismiss={onClose}
      snapPoints={['55%']}
      title="Add New Month"
    >
      <AddMonthModalContent
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        currentMonth={currentMonth}
        years={years}
        monthExists={monthExists}
        fullMonthString={fullMonthString}
        onSelectMonth={setSelectedMonth}
        onSelectYear={setSelectedYear}
        onAddMonth={handleAddMonth}
      />
    </Modal>
  );
}

function useMonthSelector(
  selectedMonth: string,
  onSelect: (month: string) => void,
  onClose: () => void
) {
  const [search, setSearch] = useState('');
  const [customMonths, setCustomMonths] = useState<string[]>([]);
  const [defaultMonth, setDefaultMonth] = useState<string | null>(null);

  // Combine default and custom months
  const allMonths = [...DEFAULT_MONTHS, ...customMonths];

  // Filter months based on search
  const filteredMonths = search.trim()
    ? allMonths.filter((month) =>
        month.toLowerCase().includes(search.toLowerCase())
      )
    : allMonths;

  // Sort to put selected month first, then default month
  const sortedMonths = [...filteredMonths].sort((a, b) => {
    if (a === selectedMonth) return -1;
    if (b === selectedMonth) return 1;
    if (a === defaultMonth) return -1;
    if (b === defaultMonth) return 1;
    return 0;
  });

  const handleSetDefault = (month: string) => {
    if (defaultMonth === month) {
      setDefaultMonth(null);
    } else {
      setDefaultMonth(month);
    }
  };

  const handleSelectMonth = (month: string) => {
    if (!allMonths.includes(month)) {
      setCustomMonths((prev) => [...prev, month]);
    }
    onSelect(month);
    onClose();
  };

  return {
    search,
    setSearch,
    sortedMonths,
    defaultMonth,
    handleSetDefault,
    handleSelectMonth,
  };
}

function MonthSelectorSheet({
  isVisible,
  onClose,
  onSelect,
  selectedMonth,
}: {
  isVisible: boolean;
  onClose: () => void;
  onSelect: (month: string) => void;
  selectedMonth: string;
}) {
  const { ref, present, dismiss } = useModal();
  const [isAddMonthModalOpen, setIsAddMonthModalOpen] = useState(false);
  const {
    search,
    setSearch,
    sortedMonths,
    defaultMonth,
    handleSetDefault,
    handleSelectMonth,
  } = useMonthSelector(selectedMonth, onSelect, onClose);

  useEffect(() => {
    if (isVisible) {
      present();
    } else {
      dismiss();
    }
  }, [isVisible, present, dismiss]);

  return (
    <>
      <Modal
        ref={ref}
        onDismiss={onClose}
        snapPoints={['70%']}
        title="Select Month"
      >
        <View className="flex-1 p-4">
          <MonthSearchBar search={search} setSearch={setSearch} />

          <View className="mb-4 rounded-lg bg-gray-50 p-3">
            <Text className="text-xs text-gray-500">
              • Selected month (
              <Ionicons name="checkmark-circle" size={12} color="#10b981" />) is
              currently being viewed
            </Text>
            <Text className="text-xs text-gray-500">
              • Default month (
              <Ionicons name="star" size={12} color="#f59e0b" />) will be loaded
              when you open the app
            </Text>
          </View>

          <ScrollView className="mb-4 flex-1">
            {sortedMonths.length > 0 ? (
              sortedMonths.map((month) => (
                <MonthOption
                  key={month}
                  month={month}
                  selectedMonth={selectedMonth}
                  onSelect={handleSelectMonth}
                  onSetDefault={handleSetDefault}
                  isDefault={month === defaultMonth}
                />
              ))
            ) : (
              <View className="items-center py-8">
                <Text className="text-gray-500">No months found</Text>
              </View>
            )}
          </ScrollView>

          <Pressable
            onPress={() => setIsAddMonthModalOpen(true)}
            className="rounded-lg bg-primary-500 py-3"
          >
            <Text className="text-center font-medium text-white">
              Add New Month
            </Text>
          </Pressable>
        </View>
      </Modal>

      <AddMonthModal
        isVisible={isAddMonthModalOpen}
        onClose={() => setIsAddMonthModalOpen(false)}
        onAddMonth={(month) => {
          handleSelectMonth(month);
          setIsAddMonthModalOpen(false);
        }}
        existingMonths={sortedMonths}
      />
    </>
  );
}

// Meal edit modal
function MealEditModal({
  isVisible,
  onClose,
  onSubmit,
  meal,
}: {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
  meal: { day: string; type: MealType; meal?: Meal };
}) {
  const { ref, present, dismiss } = useModal();
  const [searchQuery, setSearchQuery] = useState('');

  // More flexible recipe filtering
  const filteredRecipes = recipesData.filter((recipe: Recipe) => {
    const searchMatch = recipe.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    // More flexible category matching
    const categoryMatch =
      meal.type === 'Breakfast'
        ? ['Breakfast', 'Lunch'].includes(recipe.category) // Breakfast can include breakfast and lunch items
        : meal.type === 'Lunch'
          ? ['Lunch', 'Dinner'].includes(recipe.category) // Lunch can include lunch and dinner items
          : ['Dinner', 'Lunch'].includes(recipe.category); // Dinner can include dinner and lunch items

    return searchMatch && categoryMatch;
  });

  useEffect(() => {
    if (isVisible) {
      present();
    } else {
      dismiss();
    }
  }, [isVisible, present, dismiss]);

  const handleSelectRecipe = (recipe: Recipe) => {
    onSubmit(recipe.name);
    onClose();
  };

  return (
    <Modal
      ref={ref}
      onDismiss={onClose}
      snapPoints={['70%']}
      title={`Add ${meal.type} - ${meal.day}`}
    >
      <View className="flex-1 p-4">
        <View className="mb-4">
          <TextInput
            className="rounded-lg border border-gray-300 p-4"
            placeholder="Search recipes..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <ScrollView className="flex-1">
          {filteredRecipes.length > 0 ? (
            filteredRecipes.map((recipe) => (
              <Pressable
                key={recipe.id}
                onPress={() => handleSelectRecipe(recipe)}
                className="mb-2 rounded-lg border border-gray-200 p-4"
              >
                <Text className="text-base font-medium">{recipe.name}</Text>
                <View className="mt-1 flex-row items-center">
                  <Text className="text-sm text-gray-500">
                    {recipe.cookTime} mins
                  </Text>
                  <Text className="mx-2 text-gray-400">•</Text>
                  <Text className="text-sm text-gray-500">
                    {recipe.ingredients.length} ingredients
                  </Text>
                </View>
              </Pressable>
            ))
          ) : (
            <View className="items-center py-8">
              <Text className="text-gray-500">No recipes found</Text>
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}

type MonthData = {
  monthPlan: MonthPlan;
  availableWeeks: string[];
};

type MonthsData = {
  [month: string]: MonthData;
};

export default function Meals() {
  const [selectedMonth, setSelectedMonth] = useState('April 2025');
  const [currentWeek, setCurrentWeek] = useState('1');
  const [isMonthSelectorOpen, setIsMonthSelectorOpen] = useState(false);
  const [currentEditingMeal, setCurrentEditingMeal] = useState<{
    day: string;
    type: MealType;
    meal?: Meal;
  } | null>(null);

  const emptyWeek: WeekPlan = {
    Monday: {},
    Tuesday: {},
    Wednesday: {},
    Thursday: {},
    Friday: {},
    Saturday: {},
    Sunday: {},
  };

  // Store all months data
  const [monthsData, setMonthsData] = useState<MonthsData>({
    'April 2025': {
      monthPlan: {
        '1': {
          Monday: {
            breakfast: { id: '1', name: 'Brown Stew Chicken' },
          },
          Tuesday: {},
          Wednesday: {},
          Thursday: {},
          Friday: {},
          Saturday: {},
          Sunday: {},
        },
        '2': { ...emptyWeek },
      },
      availableWeeks: ['1', '2'],
    },
  });

  // Get current month's data or create empty data
  const currentMonthData = monthsData[selectedMonth] || {
    monthPlan: {
      '1': { ...emptyWeek },
      '2': { ...emptyWeek },
    },
    availableWeeks: ['1', '2'],
  };

  function handleAddWeek() {
    const nextWeekNumber = (
      currentMonthData.availableWeeks.length + 1
    ).toString();

    setMonthsData((prev) => ({
      ...prev,
      [selectedMonth]: {
        monthPlan: {
          ...currentMonthData.monthPlan,
          [nextWeekNumber]: { ...emptyWeek },
        },
        availableWeeks: [...currentMonthData.availableWeeks, nextWeekNumber],
      },
    }));
  }

  function handleAddMeal(day: string, type: MealType) {
    setCurrentEditingMeal({ day, type });
  }

  function handleEditMeal(day: string, type: MealType, meal: Meal) {
    setCurrentEditingMeal({ day, type, meal });
  }

  function handleSaveMeal(name: string) {
    if (!currentEditingMeal) return;

    const { day, type } = currentEditingMeal;
    const newMeal = {
      id: currentEditingMeal.meal?.id || Date.now().toString(),
      name,
    };

    setMonthsData((prev) => ({
      ...prev,
      [selectedMonth]: {
        ...currentMonthData,
        monthPlan: {
          ...currentMonthData.monthPlan,
          [currentWeek]: {
            ...currentMonthData.monthPlan[currentWeek],
            [day]: {
              ...currentMonthData.monthPlan[currentWeek]?.[day],
              [type.toLowerCase()]: newMeal,
            },
          },
        },
      },
    }));
  }

  function handleMonthSelect(month: string) {
    setSelectedMonth(month);
    setCurrentWeek('1'); // Reset to Week 1 when changing months
  }

  return (
    <View className="flex-1 bg-white">
      <FocusAwareStatusBar />

      {/* Fixed header section */}
      <View className="bg-white">
        <Header />
        <MonthSelector
          selectedMonth={selectedMonth}
          onPress={() => setIsMonthSelectorOpen(true)}
        />
        <WeekSelector
          currentWeek={currentWeek}
          onWeekChange={setCurrentWeek}
          availableWeeks={currentMonthData.availableWeeks}
          onAddWeek={handleAddWeek}
        />
      </View>

      {/* Scrollable content */}
      <WeekPlanner
        weekPlan={currentMonthData.monthPlan[currentWeek] || emptyWeek}
        onAddMeal={handleAddMeal}
        onEditMeal={handleEditMeal}
      />

      {/* Modals */}
      <MonthSelectorSheet
        isVisible={isMonthSelectorOpen}
        onClose={() => setIsMonthSelectorOpen(false)}
        onSelect={handleMonthSelect}
        selectedMonth={selectedMonth}
      />

      {currentEditingMeal && (
        <MealEditModal
          isVisible={!!currentEditingMeal}
          onClose={() => setCurrentEditingMeal(null)}
          onSubmit={handleSaveMeal}
          meal={currentEditingMeal}
        />
      )}
    </View>
  );
}
