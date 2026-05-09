const BASE = 'https://www.themealdb.com/api/json/v1/1';

export interface Meal {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  strTags: string | null;
  // Ingredients & measures (up to 20 pairs)
  [key: string]: string | null;
}

export interface MealSummary {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory?: string;
}

export interface Category {
  idCategory: string;
  strCategory: string;
  strCategoryThumb: string;
  strCategoryDescription: string;
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`MealDB error: ${res.status}`);
  return res.json();
}

export async function searchMeals(query: string): Promise<MealSummary[]> {
  const data = await get<{ meals: MealSummary[] | null }>(`/search.php?s=${encodeURIComponent(query)}`);
  return data.meals ?? [];
}

export async function getMealById(id: string): Promise<Meal | null> {
  const data = await get<{ meals: Meal[] | null }>(`/lookup.php?i=${id}`);
  return data.meals?.[0] ?? null;
}

export async function getRandomMeal(): Promise<Meal | null> {
  const data = await get<{ meals: Meal[] | null }>('/random.php');
  return data.meals?.[0] ?? null;
}

export async function getMealsByCategory(category: string): Promise<MealSummary[]> {
  const data = await get<{ meals: MealSummary[] | null }>(`/filter.php?c=${encodeURIComponent(category)}`);
  return data.meals ?? [];
}

export async function getCategories(): Promise<Category[]> {
  const data = await get<{ categories: Category[] }>('/categories.php');
  return data.categories;
}

/** Extract up to 20 ingredient + measure pairs from a full Meal object */
export function getIngredients(meal: Meal): { ingredient: string; measure: string }[] {
  const result: { ingredient: string; measure: string }[] = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim()) {
      result.push({ ingredient: ingredient.trim(), measure: (measure ?? '').trim() });
    }
  }
  return result;
}
