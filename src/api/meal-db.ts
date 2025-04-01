import axios from 'axios';

const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

export type MealDBRecipe = {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  strTags: string | null;
  strYoutube: string | null;
  strIngredient1: string | null;
  strIngredient2: string | null;
  strIngredient3: string | null;
  strIngredient4: string | null;
  strIngredient5: string | null;
  strIngredient6: string | null;
  strIngredient7: string | null;
  strIngredient8: string | null;
  strIngredient9: string | null;
  strIngredient10: string | null;
  strIngredient11: string | null;
  strIngredient12: string | null;
  strIngredient13: string | null;
  strIngredient14: string | null;
  strIngredient15: string | null;
  strIngredient16: string | null;
  strIngredient17: string | null;
  strIngredient18: string | null;
  strIngredient19: string | null;
  strIngredient20: string | null;
  strMeasure1: string | null;
  strMeasure2: string | null;
  strMeasure3: string | null;
  strMeasure4: string | null;
  strMeasure5: string | null;
  strMeasure6: string | null;
  strMeasure7: string | null;
  strMeasure8: string | null;
  strMeasure9: string | null;
  strMeasure10: string | null;
  strMeasure11: string | null;
  strMeasure12: string | null;
  strMeasure13: string | null;
  strMeasure14: string | null;
  strMeasure15: string | null;
  strMeasure16: string | null;
  strMeasure17: string | null;
  strMeasure18: string | null;
  strMeasure19: string | null;
  strMeasure20: string | null;
};

type MealDBResponse = {
  meals: MealDBRecipe[] | null;
};

export type Category = {
  idCategory: string;
  strCategory: string;
  strCategoryThumb: string;
  strCategoryDescription: string;
};

type CategoriesResponse = {
  categories: Category[];
};

export type SearchRecipe = {
  id: string;
  name: string;
  category: string;
  image: string;
  tags: string[];
  source?: string;
};

export const mealDB = {
  async searchRecipes(query: string): Promise<SearchRecipe[]> {
    const response = await axios.get<MealDBResponse>(
      `${BASE_URL}/search.php?s=${query}`
    );
    return (response.data.meals || []).map((recipe) => ({
      id: recipe.idMeal,
      name: recipe.strMeal,
      category: recipe.strCategory,
      image: recipe.strMealThumb,
      tags: recipe.strTags ? recipe.strTags.split(',') : [],
      source: recipe.strYoutube || undefined,
    }));
  },

  async getRecipeById(id: string): Promise<MealDBRecipe | null> {
    const response = await axios.get<MealDBResponse>(
      `${BASE_URL}/lookup.php?i=${id}`
    );
    return response.data.meals?.[0] || null;
  },

  async getCategories(): Promise<Category[]> {
    const response = await axios.get<CategoriesResponse>(
      `${BASE_URL}/categories.php`
    );
    return response.data.categories;
  },

  async getRecipesByCategory(category: string): Promise<SearchRecipe[]> {
    const response = await axios.get<MealDBResponse>(
      `${BASE_URL}/filter.php?c=${category}`
    );
    return (response.data.meals || []).map((recipe) => ({
      id: recipe.idMeal,
      name: recipe.strMeal,
      category: recipe.strCategory,
      image: recipe.strMealThumb,
      tags: [],
    }));
  },

  async getRandomRecipe(): Promise<MealDBRecipe | null> {
    const response = await axios.get<MealDBResponse>(`${BASE_URL}/random.php`);
    return response.data.meals?.[0] || null;
  },
};
