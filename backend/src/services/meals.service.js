const { pool } = require('../config/db');

const MACRO_FIELDS = ['protein', 'carbs', 'fat', 'fiber', 'sugar'];

function macroValues(meal) {
  return MACRO_FIELDS.map((field) => meal[field] ?? null);
}

/** `entry_date` is optional and defaults to today. */
async function createMeal(userId, meal) {
  const { rows } = await pool.query(
    `INSERT INTO meal_entries (user_id, food_name, calories, protein, carbs, fat, fiber, sugar, entry_date)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, COALESCE($9::date, CURRENT_DATE))
     RETURNING *`,
    [userId, meal.food_name, meal.calories, ...macroValues(meal), meal.entry_date ?? null]
  );
  return rows[0];
}

/** Returns the updated row, or null if the entry doesn't exist for this user. */
async function updateMeal(userId, mealId, meal) {
  const { rows } = await pool.query(
    `UPDATE meal_entries
     SET food_name = $1, calories = $2, protein = $3, carbs = $4, fat = $5, fiber = $6, sugar = $7
     WHERE id = $8 AND user_id = $9
     RETURNING *`,
    [meal.food_name, meal.calories, ...macroValues(meal), mealId, userId]
  );
  return rows[0] ?? null;
}

async function listMeals(userId) {
  const { rows } = await pool.query(
    'SELECT * FROM meal_entries WHERE user_id = $1 ORDER BY entry_date DESC, id DESC',
    [userId]
  );
  return rows;
}

function sumTotals(entries) {
  const totals = {
    totalCalories: 0,
    totalProtein: 0,
    totalCarbs: 0,
    totalFat: 0,
    totalFiber: 0,
    totalSugar: 0,
  };
  for (const e of entries) {
    totals.totalCalories += e.calories || 0;
    totals.totalProtein += parseFloat(e.protein) || 0;
    totals.totalCarbs += parseFloat(e.carbs) || 0;
    totals.totalFat += parseFloat(e.fat) || 0;
    totals.totalFiber += parseFloat(e.fiber) || 0;
    totals.totalSugar += parseFloat(e.sugar) || 0;
  }
  return totals;
}

/** Today's entries plus summed calories and macros. */
async function getTodaySummary(userId) {
  const { rows: entries } = await pool.query(
    'SELECT * FROM meal_entries WHERE user_id = $1 AND entry_date = CURRENT_DATE ORDER BY id DESC',
    [userId]
  );
  return { entries, ...sumTotals(entries) };
}

/** Returns true if an entry was deleted, false if none matched. */
async function deleteMeal(userId, mealId) {
  const { rowCount } = await pool.query(
    'DELETE FROM meal_entries WHERE id = $1 AND user_id = $2',
    [mealId, userId]
  );
  return rowCount > 0;
}

module.exports = { createMeal, updateMeal, listMeals, getTodaySummary, deleteMeal };
