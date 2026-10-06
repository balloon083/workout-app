const foodsService = require('../services/foods.service');
const HttpError = require('../utils/HttpError');

async function search(req, res) {
  const { query } = req.query;
  if (typeof query !== 'string' || !query.trim()) {
    throw HttpError.badRequest('A search query is required');
  }

  res.json(await foodsService.searchFoods(query));
}

module.exports = { search };
