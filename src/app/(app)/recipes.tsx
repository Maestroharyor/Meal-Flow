import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Link, router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  TextInput,
} from 'react-native';

import { type Category, mealDB, type SearchRecipe } from '@/api/meal-db';
import {
  Button,
  FocusAwareStatusBar,
  Modal,
  Text,
  useModal,
  View,
} from '@/components/ui';
import { type Recipe } from '@/types/recipe';

// Sample recipes data
export const recipesData: Recipe[] = [
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
    image:
      'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
  },
  {
    id: '2',
    name: 'Greek Salad',
    category: 'Lunch',
    cookTime: 15,
    ingredients: ['Cucumber', 'Tomatoes', 'Red onion', 'Feta cheese', 'Olives'],
    instructions: [
      'Chop all vegetables into chunks',
      'Mix vegetables in a bowl',
      'Add feta cheese and olives',
      'Dress with olive oil and season with salt and pepper',
    ],
    image:
      'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
  },
  {
    id: '3',
    name: 'Chicken Stir Fry',
    category: 'Dinner',
    cookTime: 25,
    ingredients: [
      'Chicken breast',
      'Bell peppers',
      'Broccoli',
      'Soy sauce',
      'Garlic',
    ],
    instructions: [
      'Cut chicken into bite-sized pieces',
      'Chop vegetables',
      'Stir fry chicken until golden',
      'Add vegetables and sauce',
      'Cook until vegetables are tender',
    ],
    image:
      'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
  },
  {
    id: '4',
    name: 'Pasta Carbonara',
    category: 'Dinner',
    cookTime: 20,
    ingredients: [
      'Spaghetti',
      'Eggs',
      'Pecorino Romano',
      'Guanciale',
      'Black pepper',
    ],
    instructions: [
      'Cook pasta in salted water',
      'Fry guanciale until crispy',
      'Mix eggs and cheese',
      'Combine all ingredients',
      'Add black pepper to taste',
    ],
    image:
      'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
  },
  {
    id: '5',
    name: 'Vegetable Curry',
    category: 'Dinner',
    cookTime: 30,
    ingredients: [
      'Potatoes',
      'Carrots',
      'Onion',
      'Coconut milk',
      'Curry powder',
    ],
    instructions: [
      'Chop vegetables',
      'Sauté onion and spices',
      'Add vegetables and coconut milk',
      'Simmer until vegetables are tender',
    ],
    image:
      'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
  },
];

// Common header component
function Header() {
  return (
    <View className="px-4 pt-4">
      <Text className="text-2xl font-bold">Recipes</Text>
      <Text className="text-gray-500">
        Discover and save your favorite recipes
      </Text>
    </View>
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
          activeTab === 'my' ? 'border-primary-500' : 'border-gray-300'
        }`}
        onPress={() => onTabChange('my')}
      >
        <Text
          className={`text-center font-medium ${
            activeTab === 'my' ? 'text-primary-500' : 'text-gray-500'
          }`}
        >
          My Recipes
        </Text>
      </Pressable>
      <Pressable
        className={`flex-1 border-b-2 p-3 ${
          activeTab === 'explore' ? 'border-primary-500' : 'border-gray-300'
        }`}
        onPress={() => onTabChange('explore')}
      >
        <Text
          className={`text-center font-medium ${
            activeTab === 'explore' ? 'text-primary-500' : 'text-gray-500'
          }`}
        >
          Explore
        </Text>
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
        <View className="flex-row items-center rounded-lg border border-gray-300 bg-white px-4">
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            className="ml-2 flex-1 py-3 text-base"
            placeholder="Search recipes..."
            value={value}
            onChangeText={onChangeText}
          />
          {value.length > 0 && (
            <Pressable onPress={() => onChangeText('')}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </Pressable>
          )}
        </View>
      </View>
      <Pressable
        className="ml-2 items-center justify-center rounded-lg border border-gray-300 p-3"
        onPress={onFilterPress}
      >
        <Ionicons name="options-outline" size={20} color="#666" />
      </Pressable>
    </View>
  );
}

// Recipe card component
function RecipeCard({ recipe }: { recipe: Recipe | SearchRecipe }) {
  return (
    <Link
      href={{
        pathname: '/recipe/[id]',
        params: {
          id: recipe.id,
          type: 'ingredients' in recipe ? 'local' : 'remote',
        },
      }}
      asChild
    >
      <Pressable className="mb-4 w-1/2 px-2">
        <View className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <Image
            source={{ uri: recipe.image }}
            className="aspect-square w-full"
            contentFit="cover"
          />
          <View className="p-3">
            <Text className="font-medium text-gray-800" numberOfLines={1}>
              {recipe.name}
            </Text>
            <View className="mt-1 flex-row items-center">
              <Text className="text-sm text-gray-500">{recipe.category}</Text>
              {'cookTime' in recipe && (
                <>
                  <Text className="mx-2 text-gray-400">•</Text>
                  <Text className="text-sm text-gray-500">
                    {recipe.cookTime} mins
                  </Text>
                </>
              )}
            </View>
            {'ingredients' in recipe && (
              <Text className="mt-2 text-sm text-gray-600" numberOfLines={2}>
                {recipe.ingredients.slice(0, 3).join(', ')}
                {recipe.ingredients.length > 3 ? '...' : ''}
              </Text>
            )}
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

// Recipe list component
function RecipeList({
  recipes,
  isLoading,
  onLoadMore,
}: {
  recipes: (Recipe | SearchRecipe)[];
  isLoading: boolean;
  onLoadMore?: () => void;
}) {
  const handleScroll = useCallback(
    (event: any) => {
      if (!onLoadMore || isLoading) return;

      const { layoutMeasurement, contentOffset, contentSize } =
        event.nativeEvent;
      const paddingToBottom = 20;

      if (
        layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom
      ) {
        onLoadMore();
      }
    },
    [onLoadMore, isLoading]
  );

  return (
    <ScrollView
      className="mt-4 flex-1"
      onScroll={handleScroll}
      scrollEventThrottle={400}
    >
      <View className="flex-row flex-wrap px-4">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </View>
      {isLoading && (
        <View className="py-4">
          <ActivityIndicator size="large" color="#0284c7" />
        </View>
      )}
      {!isLoading && recipes.length === 0 && (
        <View className="flex-1 items-center justify-center py-8">
          <Text className="text-gray-500">No recipes found</Text>
        </View>
      )}
    </ScrollView>
  );
}

type RecipeHeaderProps = {
  activeTab: 'my' | 'explore';
  setActiveTab: (tab: 'my' | 'explore') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string | null) => void;
  setPage: (page: number) => void;
  setHasMore: (hasMore: boolean) => void;
  toggleFilter: () => void;
};

function RecipeHeader(props: RecipeHeaderProps) {
  const {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    setSelectedCategory,
    setPage,
    setHasMore,
    toggleFilter,
  } = props;

  return (
    <View className="bg-white">
      <Header />
      <TabSelectors activeTab={activeTab} onTabChange={setActiveTab} />
      <SearchBar
        value={searchQuery}
        onChangeText={(text) => {
          setSearchQuery(text);
          setSelectedCategory(null);
          setPage(1);
          setHasMore(true);
        }}
        onFilterPress={toggleFilter}
      />
      {activeTab === 'my' && (
        <AddRecipeButton onPress={() => router.push('/recipe/new')} />
      )}
    </View>
  );
}

function RecipeMetadata({ recipe }: { recipe: Recipe | SearchRecipe }) {
  return (
    <View className="mt-4 flex-row">
      <View className="rounded-full bg-gray-200 px-3 py-1">
        <Text>{recipe.category}</Text>
      </View>
      {'cookTime' in recipe && (
        <View className="ml-2 flex-row items-center">
          <Ionicons name="time-outline" size={16} color="#666" />
          <Text className="ml-1 text-gray-500">{recipe.cookTime} mins</Text>
        </View>
      )}
    </View>
  );
}

function RecipeIngredients({ recipe }: { recipe: Recipe }) {
  return (
    <>
      <Text className="mt-6 text-lg font-bold">Ingredients</Text>
      <View className="mt-2">
        {recipe.ingredients.map((ingredient, index) => (
          <View key={index} className="mb-2 flex-row">
            <Text className="mr-2">•</Text>
            <Text>{ingredient}</Text>
          </View>
        ))}
      </View>
    </>
  );
}

function RecipeInstructions({ recipe }: { recipe: Recipe }) {
  return (
    <>
      <Text className="mt-6 text-lg font-bold">Instructions</Text>
      <View className="mt-2">
        {recipe.instructions.map((instruction, index) => (
          <View key={index} className="mb-4 flex-row">
            <Text className="mr-2 font-bold">{index + 1}.</Text>
            <Text>{instruction}</Text>
          </View>
        ))}
      </View>
    </>
  );
}

function RecipeSource({ source: _source }: { source: string }) {
  return (
    <View className="mt-6">
      <Text className="text-lg font-bold">Source</Text>
      <Pressable
        className="mt-2 flex-row items-center"
        onPress={() => {
          // Handle source link
        }}
      >
        <Ionicons name="link" size={20} color="#666" />
        <Text className="ml-2 text-primary-500">View Recipe Source</Text>
      </Pressable>
    </View>
  );
}

type RecipeViewContentProps = {
  recipe: Recipe | SearchRecipe;
  onEdit: () => void;
  onDelete: () => void;
  onSave: () => void;
};

function RecipeViewContent(props: RecipeViewContentProps) {
  const { recipe, onEdit, onDelete, onSave } = props;

  return (
    <View className="flex-1 p-4">
      <View className="flex-row items-center justify-between">
        <Text className="text-2xl font-bold">{recipe.name}</Text>
        <View className="flex-row">
          {'ingredients' in recipe ? (
            <>
              <Pressable className="mr-4" onPress={onEdit}>
                <Ionicons name="pencil" size={24} color="#666" />
              </Pressable>
              <Pressable onPress={onDelete}>
                <Ionicons name="trash-outline" size={24} color="#DC2626" />
              </Pressable>
            </>
          ) : (
            <Pressable onPress={onSave}>
              <Ionicons name="bookmark-outline" size={24} color="#666" />
            </Pressable>
          )}
        </View>
      </View>
      <Image
        source={{ uri: recipe.image }}
        className="mt-4 h-48 w-full"
        contentFit="cover"
      />
      <ScrollView className="flex-1 p-5">
        <RecipeMetadata recipe={recipe} />
        {'ingredients' in recipe && <RecipeIngredients recipe={recipe} />}
        {'instructions' in recipe && <RecipeInstructions recipe={recipe} />}
        {recipe.source && <RecipeSource source={recipe.source} />}
      </ScrollView>
    </View>
  );
}

// Recipe view modal
function RecipeViewModal({
  recipe,
  onEdit,
  onDelete,
  onClose,
  onSave,
}: {
  recipe: Recipe | SearchRecipe;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
  onSave: () => void;
}) {
  const { ref, present, dismiss } = useModal();

  useEffect(() => {
    present();
  }, [present]);

  const handleClose = useCallback(() => {
    dismiss();
    // Add a slight delay before calling onClose to allow animation to complete
    setTimeout(() => {
      onClose();
    }, 200);
  }, [dismiss, onClose]);

  return (
    <Modal
      ref={ref}
      onDismiss={handleClose}
      snapPoints={['90%']}
      title="Recipe Details"
    >
      <RecipeViewContent
        recipe={recipe}
        onEdit={onEdit}
        onDelete={onDelete}
        onSave={onSave}
      />
    </Modal>
  );
}

type FilterModalProps = {
  onClose: () => void;
  onSelectCategory: (category: string) => void;
  selectedCategory: string | null;
};

function FilterModalContent({
  categories,
  selectedCategory,
  onSelectCategory,
}: {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (category: string) => void;
}) {
  return (
    <ScrollView className="max-h-96">
      {categories.map((category) => (
        <Pressable
          key={category.idCategory}
          className={`mb-2 rounded-lg p-3 ${
            selectedCategory === category.strCategory
              ? 'bg-primary-50'
              : 'bg-gray-50'
          }`}
          onPress={() => onSelectCategory(category.strCategory)}
        >
          <Text
            className={
              selectedCategory === category.strCategory
                ? 'font-medium text-primary-600'
                : 'text-gray-700'
            }
          >
            {category.strCategory}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

function FilterModal({
  onClose,
  onSelectCategory,
  selectedCategory,
}: FilterModalProps) {
  const { ref } = useModal();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const result = await mealDB.getCategories();
        setCategories(result);
      } catch (error) {
        console.error('Failed to load categories:', error);
      }
    };

    loadCategories();
  }, []);

  const handleCategorySelect = (category: string) => {
    onSelectCategory(category);
    onClose();
  };

  return (
    <Modal
      ref={ref}
      snapPoints={['40%']}
      onDismiss={onClose}
      title="Filter by Category"
    >
      <View className="rounded-t-2xl bg-white p-4">
        <View className="mb-4 flex-row items-center justify-between">
          <Text className="text-lg font-bold">Filter by Category</Text>
          <Pressable onPress={onClose}>
            <Ionicons name="close" size={24} color="#666" />
          </Pressable>
        </View>
        <FilterModalContent
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategorySelect}
        />
      </View>
    </Modal>
  );
}

function useRecipesState() {
  const [recipes] = useState<Recipe[]>(recipesData);
  const [activeTab, setActiveTab] = useState<'my' | 'explore'>('my');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState<
    Recipe | SearchRecipe | null
  >(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  // eslint-disable-next-line
  const [exploreRecipes, setExploreRecipes] = useState<SearchRecipe[]>([]);
  // eslint-disable-next-line
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  return {
    recipes,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    selectedRecipe,
    setSelectedRecipe,
    isFilterModalOpen,
    setIsFilterModalOpen,
    exploreRecipes,
    isLoading,
    selectedCategory,
    setSelectedCategory,
    page,
    setPage,
    hasMore,
    setHasMore,
  };
}

type RecipeStateWithSetters = ReturnType<typeof useRecipesState> & {
  setExploreRecipes: (
    recipes: SearchRecipe[] | ((prev: SearchRecipe[]) => SearchRecipe[])
  ) => void;
  setIsLoading: (loading: boolean) => void;
};

type RecipeSearchConfig = {
  activeTab: 'my' | 'explore';
  searchQuery: string;
  selectedCategory: string | null;
  setExploreRecipes: (recipes: SearchRecipe[]) => void;
  setIsLoading: (loading: boolean) => void;
  setHasMore: (hasMore: boolean) => void;
};

function useRecipeSearch({
  activeTab,
  searchQuery,
  selectedCategory,
  setExploreRecipes,
  setIsLoading,
  setHasMore,
}: RecipeSearchConfig) {
  useEffect(() => {
    if (activeTab !== 'explore') return;

    const searchRecipes = async () => {
      setIsLoading(true);
      try {
        let results: SearchRecipe[] = [];
        if (searchQuery.trim()) {
          results = await mealDB.searchRecipes(searchQuery);
        } else if (selectedCategory) {
          results = await mealDB.getRecipesByCategory(selectedCategory);
        }
        setExploreRecipes(results);
        setHasMore(results.length === 20); // TheMealDB usually returns 20 items per page
      } catch (error) {
        console.error('Failed to search recipes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(searchRecipes, 500);
    return () => clearTimeout(timeoutId);
  }, [
    searchQuery,
    selectedCategory,
    activeTab,
    setExploreRecipes,
    setIsLoading,
    setHasMore,
  ]);
}

function useRecipeModification(state: RecipeStateWithSetters) {
  const handleEditRecipe = useCallback(() => {
    router.push(`/recipe/${state.selectedRecipe?.id}/edit`);
    state.setSelectedRecipe(null);
  }, [state]);

  const handleDeleteRecipe = useCallback(
    (_recipeId: string) => {
      // Implementation for delete recipe
      state.setSelectedRecipe(null);
    },
    [state]
  );

  const handleSaveRecipe = useCallback(() => {
    // Implementation for saving recipe from explore
    state.setSelectedRecipe(null);
  }, [state]);

  return {
    handleEditRecipe,
    handleDeleteRecipe,
    handleSaveRecipe,
  };
}

function useRecipeActions(state: RecipeStateWithSetters) {
  const handleLoadMore = useCallback(async () => {
    if (!state.hasMore || state.isLoading || state.activeTab !== 'explore')
      return;

    state.setIsLoading(true);
    try {
      const nextPage = state.page + 1;
      let newResults: SearchRecipe[] = [];

      if (state.searchQuery.trim()) {
        // Note: TheMealDB doesn't support pagination, this is just for demonstration
        newResults = await mealDB.searchRecipes(state.searchQuery);
      } else if (state.selectedCategory) {
        newResults = await mealDB.getRecipesByCategory(state.selectedCategory);
      }

      if (newResults.length > 0) {
        state.setExploreRecipes((prev: SearchRecipe[]) => [
          ...prev,
          ...newResults,
        ]);
        state.setPage(nextPage);
        state.setHasMore(newResults.length === 20);
      } else {
        state.setHasMore(false);
      }
    } catch (error) {
      console.error('Failed to load more recipes:', error);
    } finally {
      state.setIsLoading(false);
    }
  }, [state]);

  const handleCategorySelect = useCallback(
    (category: string) => {
      state.setSelectedCategory(category);
      state.setSearchQuery('');
      state.setPage(1);
      state.setHasMore(true);
    },
    [state]
  );

  const modificationActions = useRecipeModification(state);

  const toggleFilter = useCallback(() => {
    state.setIsFilterModalOpen(!state.isFilterModalOpen);
  }, [state]);

  return {
    handleLoadMore,
    handleCategorySelect,
    toggleFilter,
    ...modificationActions,
  };
}

function useRecipes() {
  const state = useRecipesState();
  const [exploreRecipes, setExploreRecipes] = useState<SearchRecipe[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useRecipeSearch({
    activeTab: state.activeTab,
    searchQuery: state.searchQuery,
    selectedCategory: state.selectedCategory,
    setExploreRecipes,
    setIsLoading,
    setHasMore: state.setHasMore,
  });

  const stateWithSetters: RecipeStateWithSetters = {
    ...state,
    setExploreRecipes,
    setIsLoading,
  };

  const actions = useRecipeActions(stateWithSetters);

  return {
    ...state,
    exploreRecipes,
    isLoading,
    ...actions,
  };
}

function RecipeModals({
  selectedRecipe,
  isFilterModalOpen,
  selectedCategory,
  onClose,
  onSelectCategory,
  onEdit,
  onDelete,
  onSave,
}: {
  selectedRecipe: Recipe | SearchRecipe | null;
  isFilterModalOpen: boolean;
  selectedCategory: string | null;
  onClose: () => void;
  onSelectCategory: (category: string) => void;
  onEdit: () => void;
  onDelete: (id: string) => void;
  onSave: () => void;
}) {
  return (
    <>
      {selectedRecipe && (
        <RecipeViewModal
          recipe={selectedRecipe}
          onEdit={onEdit}
          onDelete={() => onDelete(selectedRecipe.id)}
          onClose={onClose}
          onSave={onSave}
        />
      )}

      {isFilterModalOpen && (
        <FilterModal
          onClose={onClose}
          onSelectCategory={onSelectCategory}
          selectedCategory={selectedCategory}
        />
      )}
    </>
  );
}

// Add recipe button
function AddRecipeButton({ onPress }: { onPress: () => void }) {
  return (
    <View className="mb-6 px-4">
      <Button
        onPress={onPress}
        className="h-[44px] rounded-xl bg-primary-500"
        label="Add Recipe"
      />
    </View>
  );
}

export default function Recipes() {
  const {
    recipes,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    selectedRecipe,
    isFilterModalOpen,
    setIsFilterModalOpen,
    exploreRecipes,
    isLoading,
    selectedCategory,
    setSelectedCategory,
    setPage,
    setHasMore,
    handleLoadMore,
    handleCategorySelect,
    handleEditRecipe,
    handleDeleteRecipe,
    handleSaveRecipe,
    toggleFilter,
  } = useRecipes();

  const displayedRecipes = activeTab === 'my' ? recipes : exploreRecipes;

  return (
    <View className="flex-1 bg-white">
      <FocusAwareStatusBar />
      <RecipeHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setSelectedCategory={setSelectedCategory}
        setPage={setPage}
        setHasMore={setHasMore}
        toggleFilter={toggleFilter}
      />
      <RecipeList
        recipes={displayedRecipes}
        isLoading={isLoading}
        onLoadMore={activeTab === 'explore' ? handleLoadMore : undefined}
      />
      <RecipeModals
        selectedRecipe={selectedRecipe}
        isFilterModalOpen={isFilterModalOpen}
        selectedCategory={selectedCategory}
        onClose={() => setIsFilterModalOpen(false)}
        onSelectCategory={handleCategorySelect}
        onEdit={handleEditRecipe}
        onDelete={handleDeleteRecipe}
        onSave={handleSaveRecipe}
      />
    </View>
  );
}
