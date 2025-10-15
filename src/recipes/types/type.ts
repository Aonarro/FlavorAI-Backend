type RecipeUser = {
  id: string;
  firstName: string;
  lastName: string;
};

type RecipeRating = {
  value: number;
  userId: string;
};

export type RecipeResponse = {
  id: string;
  title: string;
  description: string;
  ingredients: string;
  instructions: string;
  imageUrl: string | null;
  averageRating: number | null;
  createdAt: Date;
  updatedAt: Date;
  user?: RecipeUser;
  ratings: RecipeRating[];
};
