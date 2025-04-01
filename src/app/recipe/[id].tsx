import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView } from 'react-native';

import { mealDB, type MealDBRecipe, type SearchRecipe } from '@/api/meal-db';
import { recipesData } from '@/app/(app)/recipes';
import { FocusAwareStatusBar, Text, View } from '@/components/ui';
import { type Recipe } from '@/types/recipe';

type RecipeType = Recipe | SearchRecipe | MealDBRecipe;

function RecipeHeader({
  recipe,
  isLocal,
}: {
  recipe: RecipeType;
  isLocal: boolean;
}) {
  const router = useRouter();
  const recipeName = 'strMeal' in recipe ? recipe.strMeal : recipe.name;
  const recipeId = 'idMeal' in recipe ? recipe.idMeal : recipe.id;

  return (
    <View className="flex-row items-center justify-between">
      <Text className="text-2xl font-bold">{recipeName}</Text>
      {isLocal && (
        <Pressable
          className="rounded-full bg-gray-100 p-2"
          onPress={() => router.push(`/recipe/${recipeId}/edit`)}
        >
          <Ionicons name="pencil" size={24} color="#666" />
        </Pressable>
      )}
    </View>
  );
}

function RecipeIngredients({ recipe }: { recipe: RecipeType }) {
  if (!('ingredients' in recipe)) return null;

  return (
    <>
      <Text className="mt-6 text-lg font-bold">Ingredients</Text>
      <View className="mt-2">
        {recipe.ingredients.map((ingredient: string, index: number) => (
          <View key={index} className="mb-2 flex-row">
            <Text className="mr-2">•</Text>
            <Text>{ingredient}</Text>
          </View>
        ))}
      </View>
    </>
  );
}

function RecipeInstructions({ recipe }: { recipe: RecipeType }) {
  if (!('instructions' in recipe)) return null;

  return (
    <>
      <Text className="mt-6 text-lg font-bold">Instructions</Text>
      <View className="mt-2">
        {recipe.instructions.map((instruction: string, index: number) => (
          <View key={index} className="mb-4 flex-row">
            <Text className="mr-2 font-bold">{index + 1}.</Text>
            <Text>{instruction}</Text>
          </View>
        ))}
      </View>
    </>
  );
}

function RecipeContent({ recipe }: { recipe: RecipeType }) {
  const imageUrl =
    'strMealThumb' in recipe ? recipe.strMealThumb : recipe.image;
  const category =
    'strCategory' in recipe ? recipe.strCategory : recipe.category;

  return (
    <ScrollView className="flex-1">
      <Image
        source={{ uri: imageUrl }}
        className="h-64 w-full"
        contentFit="cover"
      />

      <View className="p-4">
        <RecipeHeader recipe={recipe} isLocal={'ingredients' in recipe} />

        <View className="mt-4 flex-row">
          <View className="rounded-full bg-gray-200 px-3 py-1">
            <Text>{category}</Text>
          </View>
          {'cookTime' in recipe && (
            <View className="ml-2 flex-row items-center">
              <Ionicons name="time-outline" size={16} color="#666" />
              <Text className="ml-1 text-gray-500">{recipe.cookTime} mins</Text>
            </View>
          )}
        </View>

        <RecipeIngredients recipe={recipe} />
        <RecipeInstructions recipe={recipe} />

        {'source' in recipe && recipe.source && (
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
        )}
      </View>
    </ScrollView>
  );
}

export default function RecipeDetail() {
  const { id, type } = useLocalSearchParams<{ id: string; type: string }>();
  const router = useRouter();
  const [recipe, setRecipe] = useState<RecipeType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadRecipe() {
      try {
        if (type === 'remote') {
          const remoteRecipe = await mealDB.getRecipeById(id);
          setRecipe(remoteRecipe);
        } else {
          const localRecipe = recipesData.find((r: Recipe) => r.id === id);
          setRecipe(localRecipe || null);
        }
      } catch (error) {
        console.error('Failed to load recipe:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadRecipe();
  }, [id, type]);

  return (
    <View className="flex-1 bg-white">
      <FocusAwareStatusBar />

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#0284c7" />
        </View>
      ) : !recipe ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-500">Recipe not found</Text>
        </View>
      ) : (
        <>
          <RecipeContent recipe={recipe} />
          <Pressable
            className="absolute left-4 top-12 rounded-full bg-white p-2 shadow-sm"
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#666" />
          </Pressable>
        </>
      )}
    </View>
  );
}
