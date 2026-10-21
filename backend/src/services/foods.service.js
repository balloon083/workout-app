const HttpError = require('../utils/HttpError');

const USDA_SEARCH_URL = 'https://api.nal.usda.gov/fdc/v1/foods/search';
const PAGE_SIZE = 20;

// USDA nutrient names -> our macro keys. Two sugar names exist depending on the dataset.
const NUTRIENT_MAP = {
  Energy: 'calories',
  Protein: 'protein',
  'Carbohydrate, by difference': 'carbs',
  'Total lipid (fat)': 'fat',
  'Fiber, total dietary': 'fiber',
  'Sugars, total including NLEA': 'sugar',
  'Sugars, total': 'sugar',
};

function extractMacros(foodNutrients) {
  const macros = { calories: null, protein: null, carbs: null, fat: null, fiber: null, sugar: null };
  if (!Array.isArray(foodNutrients)) return macros;

  for (const nutrient of foodNutrients) {
    const key = NUTRIENT_MAP[nutrient.nutrientName];
    if (key && macros[key] === null) {
      macros[key] = nutrient.value ?? null;
    }
  }
  return macros;
}

function toFoodResult(food) {
  return {
    fdcId: food.fdcId,
    description: food.description,
    brandOwner: food.brandOwner || null,
    servingSize: food.servingSize || null,
    servingSizeUnit: food.servingSizeUnit || null,
    ...extractMacros(food.foodNutrients),
  };
}

/** Searches the USDA FoodData Central database and normalizes the results. */
async function searchFoods(query) {
  const url = new URL(USDA_SEARCH_URL);
  url.searchParams.set('api_key', process.env.USDA_API_KEY || 'DEMO_KEY');
  url.searchParams.set('query', query);
  url.searchParams.set('pageSize', String(PAGE_SIZE));
  url.searchParams.set('dataType', 'Foundation,SR Legacy,Branded');

  const response = await fetch(url);
  if (!response.ok) {
    console.error('USDA API error:', response.status, await response.text());
    throw new HttpError(502, 'Food database lookup failed');
  }

  const data = await response.json();
  return (data.foods || []).map(toFoodResult);
}

module.exports = { searchFoods, extractMacros };
