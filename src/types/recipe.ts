export type Recipe = {
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
