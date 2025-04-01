import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import React, { useCallback, useRef, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import {
  Button,
  FocusAwareStatusBar,
  Input,
  ScrollView,
  Text,
  View,
} from '@/components/ui';

type Recipe = {
  id: string;
  name: string;
  category: string;
  cookTime: number;
  ingredients: string[];
  instructions: string[];
  image?: string;
  tags?: string[];
  source?: string;
  isSaved?: boolean;
};

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
  {
    id: '4',
    name: 'Pasta Carbonara',
    category: 'Dinner',
    cookTime: 20,
    ingredients: ['Spaghetti', 'Eggs', 'Parmesan cheese'],
    instructions: [],
  },
  {
    id: '5',
    name: 'Vegetable Curry',
    category: 'Dinner',
    cookTime: 30,
    ingredients: ['Potatoes', 'Carrots'],
    instructions: [],
  },
];

// Common header component
function RecipesHeader() {
  return (
    <>
      <Text className="text-center text-2xl font-bold">Food Planner</Text>
      <Text className="text-center text-gray-500">
        Manage your meals and groceries
      </Text>
    </>
  );
}

// Tab selectors component
function TabSelectors({
  activeTab,
  onTabChange,
}: {
  activeTab: 'my' | 'explore';
  onTabChange: (tab: 'my' | 'explore') => void;
}) {
  return (
    <View className="mt-4 flex-row">
      <Pressable
        className={`flex-1 border-b-2 p-3 ${
          activeTab === 'my' ? 'border-black' : 'border-gray-300'
        }`}
        onPress={() => onTabChange('my')}
      >
        <Text className="text-center font-medium">My Recipes</Text>
      </Pressable>
      <Pressable
        className={`flex-1 border-b-2 p-3 ${
          activeTab === 'explore' ? 'border-black' : 'border-gray-300'
        }`}
        onPress={() => onTabChange('explore')}
      >
        <Text className="text-center font-medium">Explore Recipes</Text>
      </Pressable>
    </View>
  );
}

// Search bar component
function SearchBar({
  value,
  onChangeText,
  onFilterPress,
}: {
  value: string;
  onChangeText: (text: string) => void;
  onFilterPress: () => void;
}) {
  return (
    <View className="mt-2 flex-row">
      <View className="flex-1">
        <Input
          placeholder="Search recipes..."
          value={value}
          onChangeText={onChangeText}
        />
      </View>
      <Pressable
        className="ml-2 items-center justify-center rounded-md border border-gray-300 p-3"
        onPress={onFilterPress}
      >
        <Text>📏</Text>
      </Pressable>
    </View>
  );
}

// Recipe card component
function RecipeCard({
  recipe,
  onPress,
}: {
  recipe: Recipe;
  onPress: () => void;
}) {
  return (
    <Pressable key={recipe.id} className="mb-4 w-1/2 px-2" onPress={onPress}>
      <View className="rounded-lg border border-gray-200 p-3">
        <Text className="font-bold">{recipe.name}</Text>
        <View className="flex-row items-center">
          <Text className="text-gray-500">{recipe.category}</Text>
          <Text className="mx-2 text-gray-300">•</Text>
          <Text className="text-gray-500">{recipe.cookTime} mins</Text>
        </View>
        <Text className="mt-2 text-gray-600" numberOfLines={2}>
          {recipe.ingredients.slice(0, 3).join(', ')}
          {recipe.ingredients.length > 3 ? '...' : ''}
        </Text>
        <View className="mt-3 items-center">
          <Text className="text-blue-500">View Recipe</Text>
        </View>
      </View>
    </Pressable>
  );
}

// Recipe view content component
function RecipeViewContent({
  recipe,
  onEdit,
  onDelete,
  onClose,
}: {
  recipe: Recipe;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
}) {
  return (
    <View className="flex-1 p-5">
      <View className="flex-row items-center justify-between">
        <Text className="text-2xl font-bold">{recipe.name}</Text>
        <View className="flex-row">
          <Pressable className="mr-4" onPress={onEdit}>
            <Text>✏️</Text>
          </Pressable>
          <Pressable onPress={onDelete}>
            <Text>🗑️</Text>
          </Pressable>
        </View>
      </View>

      <View className="mt-4 flex-row">
        <View className="rounded-full bg-gray-200 px-3 py-1">
          <Text>{recipe.category}</Text>
        </View>
        <View className="ml-2 flex-row items-center">
          <Text className="text-gray-500">🕒 {recipe.cookTime} mins</Text>
        </View>
      </View>

      <RecipeIngredients ingredients={recipe.ingredients} />
      <RecipeInstructions instructions={recipe.instructions} />

      <Pressable
        className="absolute right-4 top-4 rounded-full bg-gray-100 p-2"
        onPress={onClose}
      >
        <Text className="text-lg">×</Text>
      </Pressable>
    </View>
  );
}

// Recipe ingredients component
function RecipeIngredients({ ingredients }: { ingredients: string[] }) {
  return (
    <>
      <Text className="mt-6 text-lg font-bold">Ingredients</Text>
      <View className="mt-2">
        {ingredients.map((ingredient, index) => (
          <View key={index} className="mb-2 flex-row">
            <Text className="mr-2">•</Text>
            <Text>{ingredient}</Text>
          </View>
        ))}
      </View>
    </>
  );
}

// Recipe instructions component
function RecipeInstructions({ instructions }: { instructions: string[] }) {
  return (
    <>
      <Text className="mt-6 text-lg font-bold">Instructions</Text>
      <View className="mt-2">
        {instructions.map((instruction, index) => (
          <View key={index} className="mb-4 flex-row">
            <Text className="mr-2 font-bold">{index + 1}.</Text>
            <Text>{instruction}</Text>
          </View>
        ))}
      </View>
    </>
  );
}

// Recipe view modal as bottom sheet
function RecipeViewModal({
  recipe,
  onEdit,
  onDelete,
  onClose,
}: {
  recipe: Recipe;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
}) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = ['90%'];

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

  const handleClose = useCallback(() => {
    bottomSheetRef.current?.close();
    // Add a slight delay before calling onClose to allow animation to complete
    setTimeout(() => {
      onClose();
    }, 200);
  }, [onClose]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      enablePanDownToClose
      onClose={onClose}
    >
      <RecipeViewContent
        recipe={recipe}
        onEdit={onEdit}
        onDelete={onDelete}
        onClose={handleClose}
      />
    </BottomSheet>
  );
}

// Input field component for recipe edit form
function EditFormField({
  label,
  children,
  marginTop = true,
}: {
  label: string;
  children: React.ReactNode;
  marginTop?: boolean;
}) {
  return (
    <>
      <Text className={`mb-1 ${marginTop ? 'mt-4' : ''}`}>{label}</Text>
      {children}
    </>
  );
}

// Textarea component for multiline input
function EditFormTextarea({
  value,
  onChangeText,
}: {
  value: string;
  onChangeText: (text: string) => void;
}) {
  const styles = StyleSheet.create({
    textarea: {
      textAlignVertical: 'top',
      height: 100,
    },
  });

  return (
    <View className="min-h-32 rounded-md border border-gray-300 p-2">
      <Input
        multiline
        value={value}
        onChangeText={onChangeText}
        style={styles.textarea}
      />
    </View>
  );
}

// Recipe edit form
function RecipeEditForm({
  recipe,
  onSave,
  onClose,
}: {
  recipe: Recipe;
  onSave: () => void;
  onClose: () => void;
}) {
  return (
    <View className="absolute inset-0 flex-1 bg-white p-4">
      <View className="flex-row items-center justify-between">
        <Text className="text-xl font-bold">Edit Recipe</Text>
        <Pressable onPress={onClose}>
          <Text className="text-lg">×</Text>
        </Pressable>
      </View>

      <ScrollView className="mt-4">
        <EditFormField label="Recipe Name" marginTop={false}>
          <Input
            value={recipe.name}
            onChangeText={(_text) => {
              // Update recipe name
            }}
          />
        </EditFormField>

        <EditFormField label="Cook Time (mins)">
          <Input
            value={recipe.cookTime.toString()}
            keyboardType="numeric"
            onChangeText={(_text) => {
              // Update cook time
            }}
          />
        </EditFormField>

        <EditFormField label="Category">
          <Pressable className="flex-row items-center justify-between rounded-md border border-gray-300 p-3">
            <Text>{recipe.category}</Text>
            <Text>▼</Text>
          </Pressable>
        </EditFormField>

        <EditFormField label="Ingredients (one per line)">
          <EditFormTextarea
            value={recipe.ingredients.join('\n')}
            onChangeText={(_text) => {
              // Update ingredients
            }}
          />
        </EditFormField>

        <EditFormField label="Instructions (one step per line)">
          <EditFormTextarea
            value={recipe.instructions.join('\n')}
            onChangeText={(_text) => {
              // Update instructions
            }}
          />
        </EditFormField>

        <Button label="Save Changes" onPress={onSave} className="mt-6" />
      </ScrollView>
    </View>
  );
}

// Filter modal as bottom sheet
function FilterModal({ onClose }: { onClose: () => void }) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = ['40%'];

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
      onClose={onClose}
    >
      <View className="flex-1 p-5">
        <Text className="mb-4 text-center text-xl font-bold">
          Filter Recipes
        </Text>

        <Text className="mb-1">Category</Text>
        <Pressable className="flex-row items-center justify-between rounded-md border border-gray-300 p-3">
          <Text>All</Text>
          <Text>▼</Text>
        </Pressable>

        <Text className="mb-1 mt-4">Source</Text>
        <Pressable className="flex-row items-center justify-between rounded-md border border-gray-300 p-3">
          <Text>All Sources</Text>
          <Text>▼</Text>
        </Pressable>
      </View>
    </BottomSheet>
  );
}

// Recipe list component
function RecipeList({
  recipes,
  onRecipePress,
}: {
  recipes: Recipe[];
  onRecipePress: (recipe: Recipe) => void;
}) {
  return (
    <ScrollView className="mt-4 flex-1">
      <View className="flex-row flex-wrap">
        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onPress={() => onRecipePress(recipe)}
          />
        ))}
      </View>
    </ScrollView>
  );
}

// Main component splits
function RecipeMainContent({
  recipes,
  activeTab,
  searchQuery,
  setActiveTab,
  setSearchQuery,
  toggleFilter,
  handleRecipePress,
}: {
  recipes: Recipe[];
  activeTab: 'my' | 'explore';
  searchQuery: string;
  setActiveTab: (tab: 'my' | 'explore') => void;
  setSearchQuery: (query: string) => void;
  toggleFilter: () => void;
  handleRecipePress: (recipe: Recipe) => void;
}) {
  return (
    <>
      <RecipesHeader />

      <Pressable className="mt-4 flex-row items-center justify-between rounded-md border border-gray-300 p-3">
        <Text>April 2025</Text>
        <Text>▼</Text>
      </Pressable>

      <TabSelectors activeTab={activeTab} onTabChange={setActiveTab} />

      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        onFilterPress={toggleFilter}
      />

      <RecipeList recipes={recipes} onRecipePress={handleRecipePress} />
    </>
  );
}

// Modals container component
function RecipeModals({
  selectedRecipe,
  isEditMode,
  isFilterModalOpen,
  handleEditRecipe,
  handleDeleteRecipe,
  handleSaveChanges,
  setIsEditMode,
  setSelectedRecipe,
  setIsFilterModalOpen,
}: {
  selectedRecipe: Recipe | null;
  isEditMode: boolean;
  isFilterModalOpen: boolean;
  handleEditRecipe: () => void;
  handleDeleteRecipe: (recipeId: string) => void;
  handleSaveChanges: () => void;
  setIsEditMode: (value: boolean) => void;
  setSelectedRecipe: (recipe: Recipe | null) => void;
  setIsFilterModalOpen: (value: boolean) => void;
}) {
  return (
    <>
      {selectedRecipe && !isEditMode && (
        <RecipeViewModal
          recipe={selectedRecipe}
          onEdit={handleEditRecipe}
          onDelete={() => handleDeleteRecipe(selectedRecipe.id)}
          onClose={() => setSelectedRecipe(null)}
        />
      )}

      {selectedRecipe && isEditMode && (
        <RecipeEditForm
          recipe={selectedRecipe}
          onSave={handleSaveChanges}
          onClose={() => {
            setIsEditMode(false);
            setSelectedRecipe(null);
          }}
        />
      )}

      {isFilterModalOpen && (
        <FilterModal onClose={() => setIsFilterModalOpen(false)} />
      )}
    </>
  );
}

// Main component
export default function Recipes() {
  const [recipes] = useState<Recipe[]>(recipesData);
  const [activeTab, setActiveTab] = useState<'my' | 'explore'>('my');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  function handleRecipePress(recipe: Recipe) {
    setSelectedRecipe(recipe);
  }

  function handleEditRecipe() {
    setIsEditMode(true);
  }

  function handleDeleteRecipe(_recipeId: string) {
    // Implementation for delete recipe
    setSelectedRecipe(null);
  }

  function handleSaveChanges() {
    // Implementation for saving recipe changes
    setIsEditMode(false);
    setSelectedRecipe(null);
  }

  function toggleFilter() {
    setIsFilterModalOpen(!isFilterModalOpen);
  }

  return (
    <>
      <FocusAwareStatusBar />
      <View className="flex-1 p-4 pt-12">
        <RecipeMainContent
          recipes={recipes}
          activeTab={activeTab}
          searchQuery={searchQuery}
          setActiveTab={setActiveTab}
          setSearchQuery={setSearchQuery}
          toggleFilter={toggleFilter}
          handleRecipePress={handleRecipePress}
        />

        <RecipeModals
          selectedRecipe={selectedRecipe}
          isEditMode={isEditMode}
          isFilterModalOpen={isFilterModalOpen}
          handleEditRecipe={handleEditRecipe}
          handleDeleteRecipe={handleDeleteRecipe}
          handleSaveChanges={handleSaveChanges}
          setIsEditMode={setIsEditMode}
          setSelectedRecipe={setSelectedRecipe}
          setIsFilterModalOpen={setIsFilterModalOpen}
        />
      </View>
    </>
  );
}
