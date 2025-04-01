import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
} from 'react-native';

import { recipesData } from '@/app/(app)/recipes';
import { Button, FocusAwareStatusBar, Text, View } from '@/components/ui';
import { type Recipe } from '@/types/recipe';

type FormField = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  multiline?: boolean;
  numberOfLines?: number;
  keyboardType?: 'default' | 'number-pad';
};

function FormInput({
  label,
  value,
  onChangeText,
  placeholder,
  multiline,
  numberOfLines,
  keyboardType = 'default',
}: FormField) {
  return (
    <View>
      <Text className="mb-1 font-medium">{label}</Text>
      <TextInput
        className="rounded-lg border border-gray-300 bg-white px-4 py-3"
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        multiline={multiline}
        numberOfLines={numberOfLines}
        textAlignVertical={multiline ? 'top' : undefined}
        keyboardType={keyboardType}
      />
    </View>
  );
}

function Header({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: () => void;
}) {
  return (
    <View className="flex-row items-center justify-between border-b border-gray-200 p-4">
      <Pressable className="rounded-full p-2" onPress={onClose}>
        <Ionicons name="close" size={24} color="#666" />
      </Pressable>
      <Text className="text-lg font-semibold">Edit Recipe</Text>
      <Button
        onPress={onSave}
        className="h-[36px] rounded-lg bg-primary-500 px-4"
        label="Save"
      />
    </View>
  );
}

function BasicFields({
  name,
  setName,
  category,
  setCategory,
  cookTime,
  setCookTime,
  image,
  setImage,
}: {
  name: string;
  setName: (text: string) => void;
  category: string;
  setCategory: (text: string) => void;
  cookTime: string;
  setCookTime: (text: string) => void;
  image: string;
  setImage: (text: string) => void;
}) {
  return (
    <>
      <FormInput
        label="Name"
        value={name}
        onChangeText={setName}
        placeholder="Recipe name"
      />
      <FormInput
        label="Category"
        value={category}
        onChangeText={setCategory}
        placeholder="Category"
      />
      <FormInput
        label="Cook Time (minutes)"
        value={cookTime}
        onChangeText={setCookTime}
        placeholder="Cook time in minutes"
        keyboardType="number-pad"
      />
      <FormInput
        label="Image URL"
        value={image}
        onChangeText={setImage}
        placeholder="Image URL"
      />
    </>
  );
}

function RecipeSteps({
  ingredients,
  setIngredients,
  instructions,
  setInstructions,
}: {
  ingredients: string[];
  setIngredients: (ingredients: string[]) => void;
  instructions: string[];
  setInstructions: (instructions: string[]) => void;
}) {
  return (
    <>
      <FormInput
        label="Ingredients"
        value={ingredients.join('\n')}
        onChangeText={(text) => setIngredients(text.split('\n'))}
        placeholder="Enter ingredients (one per line)"
        multiline
        numberOfLines={6}
      />
      <FormInput
        label="Instructions"
        value={instructions.join('\n')}
        onChangeText={(text) => setInstructions(text.split('\n'))}
        placeholder="Enter instructions (one per line)"
        multiline
        numberOfLines={8}
      />
    </>
  );
}

function RecipeForm(props: {
  name: string;
  setName: (text: string) => void;
  category: string;
  setCategory: (text: string) => void;
  cookTime: string;
  setCookTime: (text: string) => void;
  image: string;
  setImage: (text: string) => void;
  ingredients: string[];
  setIngredients: (ingredients: string[]) => void;
  instructions: string[];
  setInstructions: (instructions: string[]) => void;
}) {
  return (
    <ScrollView className="flex-1 p-4">
      <View className="space-y-4">
        <BasicFields {...props} />
        <RecipeSteps {...props} />
      </View>
    </ScrollView>
  );
}

function useRecipeForm(id: string) {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [cookTime, setCookTime] = useState('');
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [instructions, setInstructions] = useState<string[]>([]);
  const [image, setImage] = useState('');

  useEffect(() => {
    const loadRecipe = () => {
      const foundRecipe = recipesData.find((r) => r.id === id);
      if (foundRecipe) {
        setRecipe(foundRecipe);
        setName(foundRecipe.name);
        setCategory(foundRecipe.category);
        setCookTime(foundRecipe.cookTime.toString());
        setIngredients(foundRecipe.ingredients);
        setInstructions(foundRecipe.instructions);
        setImage(foundRecipe.image || '');
      }
      setIsLoading(false);
    };

    loadRecipe();
  }, [id]);

  return {
    recipe,
    isLoading,
    formState: {
      name,
      setName,
      category,
      setCategory,
      cookTime,
      setCookTime,
      ingredients,
      setIngredients,
      instructions,
      setInstructions,
      image,
      setImage,
    },
  };
}

export default function EditRecipe() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { recipe, isLoading, formState } = useRecipeForm(id);

  const handleSave = () => {
    // Here you would implement the save logic
    // For now, we'll just go back
    router.push('/(app)');
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#0284c7" />
      </View>
    );
  }

  if (!recipe) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-gray-500">Recipe not found</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <FocusAwareStatusBar />

      <View className="flex-1">
        <Header onClose={() => router.back()} onSave={handleSave} />
        <RecipeForm {...formState} />
      </View>
    </KeyboardAvoidingView>
  );
}
