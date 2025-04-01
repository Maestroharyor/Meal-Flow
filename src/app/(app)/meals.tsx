/* eslint-disable max-lines-per-function */
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import React, { useCallback, useRef, useState } from 'react';
import { Pressable } from 'react-native';

import {
  Button,
  FocusAwareStatusBar,
  ScrollView,
  Text,
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

type WeekPlan = {
  [day: string]: DayMeals;
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

// Common header component
function Header() {
  return (
    <>
      <Text className="text-center text-2xl font-bold">Food Planner</Text>
      <Text className="text-center text-gray-500">
        Manage your meals and groceries
      </Text>
    </>
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
      className="mt-4 flex-row items-center justify-between rounded-md border border-gray-300 p-3"
      onPress={onPress}
    >
      <Text>{selectedMonth}</Text>
      <Text>▼</Text>
    </Pressable>
  );
}

// Month selection modal as bottom sheet
function MonthSelectionModal({
  months,
  selectedMonth,
  onSelect,
  onAddNew,
  onSetDefault,
}: {
  months: string[];
  selectedMonth: string;
  onSelect: (month: string) => void;
  onAddNew: () => void;
  onSetDefault: (month: string) => void;
}) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = ['50%'];

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

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      enablePanDownToClose
    >
      <View className="flex-1 px-4">
        <Text className="mb-4 text-center text-xl font-bold">Select Month</Text>

        {months.map((month) => (
          <Pressable
            key={month}
            className="mt-2 flex-row items-center justify-between p-3"
            onPress={() => onSelect(month)}
          >
            <Text>{month}</Text>
            {month === 'March 2025' && (
              <Text className="text-yellow-500">★</Text>
            )}
            {month === selectedMonth && <Text>✓</Text>}
          </Pressable>
        ))}

        <View className="mt-4 border-t border-gray-200 pt-2">
          <Pressable className="flex-row items-center p-3" onPress={onAddNew}>
            <Text className="mr-2">+</Text>
            <Text>Add New Month</Text>
          </Pressable>

          <Pressable
            className="flex-row items-center p-3"
            onPress={() => onSetDefault(selectedMonth)}
          >
            <Text className="mr-2">★</Text>
            <Text>Set as Default</Text>
          </Pressable>
        </View>
      </View>
    </BottomSheet>
  );
}

// Meal edit modal as bottom sheet
function MealEditModal({
  meal,
  onSave,
  onRemove,
}: {
  meal: { day: string; type: MealType; meal?: Meal };
  onSave: (name: string) => void;
  onRemove: () => void;
}) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = ['50%'];

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

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      enablePanDownToClose
    >
      <View className="flex-1 p-4">
        <Text className="mb-4 text-center text-xl font-bold">
          {meal.day} - {meal.type}
        </Text>

        <Text className="mt-4">Select Recipe</Text>
        <Pressable className="mt-2 flex-row items-center justify-between rounded-md border border-gray-300 p-3">
          <Text>{meal.meal?.name || 'Select a recipe'}</Text>
          <Text>▼</Text>
        </Pressable>

        <View className="mt-4 flex-row justify-between">
          <Button
            label="Remove Meal"
            onPress={onRemove}
            className="bg-red-500"
          />
          <Button
            label="Save Meal"
            onPress={() => onSave(meal.meal?.name || 'Custom Meal')}
          />
        </View>
      </View>
    </BottomSheet>
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
  return (
    <View key={day} className="mb-6 rounded-lg border border-gray-200 p-4">
      <Text className="mb-4 text-xl font-bold">{day}</Text>
      <View className="flex-row justify-between">
        {mealTypes.map((type) => {
          const mealKey = type.toLowerCase() as keyof DayMeals;
          const meal = dayMeals[mealKey];

          return (
            <View key={type} className="w-[30%]">
              <Text className="mb-2 text-center text-sm text-gray-500">
                {type}
              </Text>
              {meal ? (
                <Pressable
                  onPress={() => onEditMeal(day, type, meal)}
                  className="h-20 items-center justify-center rounded-md bg-gray-100 p-2"
                >
                  <Text className="text-center">{meal.name}</Text>
                  <Text className="text-center text-gray-400">✏️</Text>
                </Pressable>
              ) : (
                <Pressable
                  onPress={() => onAddMeal(day, type)}
                  className="h-20 items-center justify-center rounded-md bg-gray-100 p-2"
                >
                  <Text className="text-3xl text-gray-400">+</Text>
                </Pressable>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
}

// Week planner component
// eslint-disable-next-line max-lines-per-function
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
    <ScrollView className="mt-4">
      {daysOfWeek.map((day) => (
        <DayMealPlanner
          key={day}
          day={day}
          dayMeals={weekPlan[day] || {}}
          onAddMeal={onAddMeal}
          onEditMeal={onEditMeal}
        />
      ))}
    </ScrollView>
  );
}

// eslint-disable-next-line max-lines-per-function
function useMonthSelection() {
  const [months] = useState(['April 2025', 'March 2025']);
  const [selectedMonth, setSelectedMonth] = useState(months[0]);
  const [isMonthSelectorOpen, setIsMonthSelectorOpen] = useState(false);

  function handleSetDefaultMonth(month: string) {
    // Implementation for setting default month
    setSelectedMonth(month);
    setIsMonthSelectorOpen(false);
  }

  function handleAddNewMonth() {
    // Implementation for adding new month
    setIsMonthSelectorOpen(false);
  }

  const toggleMonthSelector = () => setIsMonthSelectorOpen(true);

  return {
    months,
    selectedMonth,
    setSelectedMonth,
    isMonthSelectorOpen,
    setIsMonthSelectorOpen,
    handleSetDefaultMonth,
    handleAddNewMonth,
    toggleMonthSelector,
  };
}

type MealEditingContext = {
  setWeekPlan: React.Dispatch<React.SetStateAction<WeekPlan>>;
  currentEditingMeal: { day: string; type: MealType; meal?: Meal } | null;
  setCurrentEditingMeal: React.Dispatch<
    React.SetStateAction<{ day: string; type: MealType; meal?: Meal } | null>
  >;
};

function createMealUtils(context: MealEditingContext) {
  const { setWeekPlan, currentEditingMeal, setCurrentEditingMeal } = context;

  function saveMeal(name: string) {
    if (!currentEditingMeal) return;

    const { day, type } = currentEditingMeal;
    const newMeal = {
      id: currentEditingMeal.meal?.id || Date.now().toString(),
      name,
    };

    setWeekPlan((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [type.toLowerCase()]: newMeal,
      },
    }));

    setCurrentEditingMeal(null);
  }

  function removeMeal() {
    if (!currentEditingMeal) return;

    const { day, type } = currentEditingMeal;

    setWeekPlan((prev) => {
      const updatedDay = { ...prev[day] };
      delete updatedDay[type.toLowerCase() as keyof DayMeals];

      return {
        ...prev,
        [day]: updatedDay,
      };
    });

    setCurrentEditingMeal(null);
  }

  return { saveMeal, removeMeal };
}

// eslint-disable-next-line max-lines-per-function
function useMealEditor() {
  const [currentEditingMeal, setCurrentEditingMeal] = useState<{
    day: string;
    type: MealType;
    meal?: Meal;
  } | null>(null);

  const [weekPlan, setWeekPlan] = useState<WeekPlan>({
    Monday: {
      breakfast: { id: '1', name: 'Brown Stew Chicken' },
    },
    Tuesday: {},
    Wednesday: {},
    Thursday: {},
    Friday: {},
    Saturday: {},
    Sunday: {},
  });

  function handleAddMeal(day: string, type: MealType) {
    setCurrentEditingMeal({ day, type });
  }

  function handleEditMeal(day: string, type: MealType, meal: Meal) {
    setCurrentEditingMeal({ day, type, meal });
  }

  const { saveMeal, removeMeal } = createMealUtils({
    setWeekPlan,
    currentEditingMeal,
    setCurrentEditingMeal,
  });

  return {
    currentEditingMeal,
    weekPlan,
    handleAddMeal,
    handleEditMeal,
    saveMeal,
    removeMeal,
  };
}

/* eslint-disable max-lines-per-function */
function useMealPlanner() {
  const monthSelection = useMonthSelection();
  const mealEditor = useMealEditor();

  return {
    ...monthSelection,
    ...mealEditor,
  };
}
/* eslint-enable max-lines-per-function */

export default function Meals() {
  const {
    months,
    selectedMonth,
    setSelectedMonth,
    isMonthSelectorOpen,
    currentEditingMeal,
    weekPlan,
    handleAddMeal,
    handleEditMeal,
    saveMeal,
    removeMeal,
    handleSetDefaultMonth,
    handleAddNewMonth,
    toggleMonthSelector,
  } = useMealPlanner();

  return (
    <>
      <FocusAwareStatusBar />
      <View className="flex-1 p-4 pt-12">
        <Header />

        <MonthSelector
          selectedMonth={selectedMonth}
          onPress={toggleMonthSelector}
        />

        <WeekPlanner
          weekPlan={weekPlan}
          onAddMeal={handleAddMeal}
          onEditMeal={handleEditMeal}
        />

        {currentEditingMeal && (
          <MealEditModal
            meal={currentEditingMeal}
            onSave={saveMeal}
            onRemove={removeMeal}
          />
        )}

        {isMonthSelectorOpen && (
          <MonthSelectionModal
            months={months}
            selectedMonth={selectedMonth}
            onSelect={setSelectedMonth}
            onAddNew={handleAddNewMonth}
            onSetDefault={handleSetDefaultMonth}
          />
        )}
      </View>
    </>
  );
}
