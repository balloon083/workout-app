const mealsService = require('../services/meals.service');
const HttpError = require('../utils/HttpError');
const { parseId } = require('../utils/validation');

function readMeal(body) {
  const meal = body ?? {};
  if (!meal.food_name || meal.calories === undefined) {
    throw HttpError.badRequest('food_name and calories are required');
  }
  return meal;
}

async function create(req, res) {
  const meal = await mealsService.createMeal(req.userId, readMeal(req.body));
  res.status(201).json(meal);
}

async function update(req, res) {
  const id = parseId(req.params.id);
  const meal = await mealsService.updateMeal(req.userId, id, readMeal(req.body));
  if (!meal) throw HttpError.notFound('Meal entry not found');
  res.json(meal);
}

async function list(req, res) {
  res.json(await mealsService.listMeals(req.userId));
}

async function today(req, res) {
  res.json(await mealsService.getTodaySummary(req.userId));
}

async function remove(req, res) {
  const deleted = await mealsService.deleteMeal(req.userId, parseId(req.params.id));
  if (!deleted) throw HttpError.notFound('Meal entry not found');
  res.json({ deleted: true });
}

module.exports = { create, update, list, today, remove };
